using TalentVault.Application.Services;

namespace TalentVault.Infrastructure.Storage;

public class SupabaseStorageService : IStorageService
{
    private const string BucketName = "resumes";
    private const long MaxFileSizeBytes = 5 * 1024 * 1024; // 5MB

    public SupabaseStorageService()
    {
        // TODO: Initialize Supabase client with configuration
        // var supabaseUrl = configuration["Supabase:Url"];
        // var supabaseKey = configuration["Supabase:Key"];
        // _client = new SupabaseClient(supabaseUrl, supabaseKey);
    }

    public async Task<string> UploadResumeAsync(Guid candidateId, Stream fileStream, string fileName, CancellationToken cancellationToken = default)
    {
        // Validate file size
        if (fileStream.Length > MaxFileSizeBytes)
        {
            throw new InvalidOperationException("Arquivo excede o tamanho máximo de 5MB");
        }

        // Validate file extension
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (extension != ".pdf")
        {
            throw new InvalidOperationException("Apenas arquivos PDF são permitidos");
        }

        // TODO: Implement actual upload to Supabase
        // var path = $"resumes/{candidateId}.pdf";
        // await _client.Storage.From(BucketName).Upload(fileStream, path);
        // return $"{supabaseUrl}/storage/v1/object/public/{BucketName}/{path}";

        // Placeholder return for now
        return $"https://placeholder.supabase.co/storage/v1/object/public/{BucketName}/resumes/{candidateId}.pdf";
    }

    public async Task<Stream> DownloadResumeAsync(Guid candidateId, CancellationToken cancellationToken = default)
    {
        // TODO: Implement actual download from Supabase
        // var path = $"resumes/{candidateId}.pdf";
        // return await _client.Storage.From(BucketName).Download(path);
        
        throw new NotImplementedException("Download não implementado");
    }

    public async Task DeleteResumeAsync(Guid candidateId, CancellationToken cancellationToken = default)
    {
        // TODO: Implement actual delete from Supabase
        // var path = $"resumes/{candidateId}.pdf";
        // await _client.Storage.From(BucketName).Remove(new List<string> { path });
        
        await Task.CompletedTask;
    }
}
