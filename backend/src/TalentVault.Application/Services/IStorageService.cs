namespace TalentVault.Application.Services;

public interface IStorageService
{
    Task<string> UploadResumeAsync(Guid companyId, Guid candidateId, Stream fileStream, string fileName, CancellationToken cancellationToken = default);
    Task<Stream> DownloadResumeAsync(Guid companyId, Guid candidateId, CancellationToken cancellationToken = default);
    Task DeleteResumeAsync(Guid companyId, Guid candidateId, CancellationToken cancellationToken = default);
}
