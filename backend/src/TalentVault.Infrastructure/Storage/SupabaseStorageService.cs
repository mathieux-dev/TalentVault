using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Options;
using TalentVault.Application.Services;

namespace TalentVault.Infrastructure.Storage;

public class SupabaseStorageService : IStorageService
{
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

    private readonly IHttpClientFactory _httpClientFactory;
    private readonly SupabaseOptions _options;

    public SupabaseStorageService(IHttpClientFactory httpClientFactory, IOptions<SupabaseOptions> options)
    {
        _httpClientFactory = httpClientFactory;
        _options = options.Value;
    }

    public async Task<string> UploadResumeAsync(Guid companyId, Guid candidateId, Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        if (fileStream.Length > MaxFileSizeBytes)
            throw new InvalidOperationException("Arquivo excede o tamanho máximo de 5MB");

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (extension != ".pdf")
            throw new InvalidOperationException("Apenas arquivos PDF são permitidos");

        var objectPath = GetObjectPath(companyId, candidateId);
        var url = $"{_options.Url}/storage/v1/object/{_options.BucketName}/{objectPath}";

        var client = _httpClientFactory.CreateClient("Supabase");
        using var request = new HttpRequestMessage(HttpMethod.Put, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ServiceRoleKey);
        request.Headers.Add("x-upsert", "true");

        using var content = new StreamContent(fileStream);
        content.Headers.ContentType = new MediaTypeHeaderValue("application/pdf");
        request.Content = content;

        var response = await client.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();

        return $"{_options.Url}/storage/v1/object/public/{_options.BucketName}/{objectPath}";
    }

    public async Task<Stream> DownloadResumeAsync(Guid companyId, Guid candidateId, CancellationToken cancellationToken = default)
    {
        var candidateOnlyPath = GetLegacyObjectPath(candidateId);
        var legacyResumesFolderPath = GetLegacyResumesFolderPath(candidateId);
        var pathsToTry = new[]
        {
            GetObjectPath(companyId, candidateId),
            candidateOnlyPath,
            legacyResumesFolderPath
        };

        foreach (var path in pathsToTry)
        {
            var stream = await TryDownloadByObjectPathAsync(path, cancellationToken);
            if (stream != null)
            {
                return stream;
            }
        }

        throw new InvalidOperationException("Currículo não encontrado no storage");
    }

    public async Task DeleteResumeAsync(Guid companyId, Guid candidateId, CancellationToken cancellationToken = default)
    {
        var pathsToDelete = new[]
        {
            GetObjectPath(companyId, candidateId),
            GetLegacyObjectPath(candidateId),
            GetLegacyResumesFolderPath(candidateId)
        };

        var url = $"{_options.Url}/storage/v1/object/{_options.BucketName}";
        var client = _httpClientFactory.CreateClient("Supabase");

        foreach (var objectPath in pathsToDelete)
        {
            using var request = new HttpRequestMessage(HttpMethod.Delete, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ServiceRoleKey);

            var body = JsonSerializer.Serialize(new { prefixes = new[] { objectPath } });
            request.Content = new StringContent(body, Encoding.UTF8, "application/json");

            var response = await client.SendAsync(request, cancellationToken);
            if (response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                continue;
            }

            response.EnsureSuccessStatusCode();
        }
    }

    private async Task<Stream?> TryDownloadByObjectPathAsync(string objectPath, CancellationToken cancellationToken)
    {
        var url = $"{_options.Url}/storage/v1/object/authenticated/{_options.BucketName}/{objectPath}";

        var client = _httpClientFactory.CreateClient("Supabase");
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ServiceRoleKey);

        var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        if (response.StatusCode == System.Net.HttpStatusCode.NotFound ||
            response.StatusCode == System.Net.HttpStatusCode.BadRequest)
        {
            return null;
        }

        response.EnsureSuccessStatusCode();

        var memoryStream = new MemoryStream();
        await response.Content.CopyToAsync(memoryStream, cancellationToken);
        memoryStream.Position = 0;
        return memoryStream;
    }

    private static string GetObjectPath(Guid companyId, Guid candidateId)
    {
        return $"{companyId:D}/{candidateId:D}.pdf";
    }

    private static string GetLegacyObjectPath(Guid candidateId)
    {
        return $"{candidateId:D}.pdf";
    }

    private static string GetLegacyResumesFolderPath(Guid candidateId)
    {
        return $"resumes/{candidateId:D}.pdf";
    }
}
