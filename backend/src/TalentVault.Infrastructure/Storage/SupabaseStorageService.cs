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

    public async Task<string> UploadResumeAsync(Guid candidateId, Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        if (fileStream.Length > MaxFileSizeBytes)
            throw new InvalidOperationException("Arquivo excede o tamanho máximo de 5MB");

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (extension != ".pdf")
            throw new InvalidOperationException("Apenas arquivos PDF são permitidos");

        var objectPath = GetObjectPath(candidateId);
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

    public async Task<Stream> DownloadResumeAsync(Guid candidateId, CancellationToken cancellationToken = default)
    {
        var objectPath = GetObjectPath(candidateId);
        var url = $"{_options.Url}/storage/v1/object/authenticated/{_options.BucketName}/{objectPath}";

        var client = _httpClientFactory.CreateClient("Supabase");
        using var request = new HttpRequestMessage(HttpMethod.Get, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ServiceRoleKey);

        var response = await client.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken);
        response.EnsureSuccessStatusCode();

        var memoryStream = new MemoryStream();
        await response.Content.CopyToAsync(memoryStream, cancellationToken);
        memoryStream.Position = 0;
        return memoryStream;
    }

    public async Task DeleteResumeAsync(Guid candidateId, CancellationToken cancellationToken = default)
    {
        var objectPath = GetObjectPath(candidateId);
        var url = $"{_options.Url}/storage/v1/object/{_options.BucketName}";

        var client = _httpClientFactory.CreateClient("Supabase");
        using var request = new HttpRequestMessage(HttpMethod.Delete, url);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ServiceRoleKey);

        var body = JsonSerializer.Serialize(new { prefixes = new[] { objectPath } });
        request.Content = new StringContent(body, Encoding.UTF8, "application/json");

        var response = await client.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }

    private static string GetObjectPath(Guid candidateId)
    {
        return $"{candidateId}.pdf";
    }
}
