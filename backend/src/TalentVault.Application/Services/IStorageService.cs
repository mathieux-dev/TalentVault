namespace TalentVault.Application.Services;

public interface IStorageService
{
    Task<string> UploadResumeAsync(Guid candidateId, Stream fileStream, string fileName, CancellationToken cancellationToken = default);
    Task<Stream> DownloadResumeAsync(Guid candidateId, CancellationToken cancellationToken = default);
    Task DeleteResumeAsync(Guid candidateId, CancellationToken cancellationToken = default);
}
