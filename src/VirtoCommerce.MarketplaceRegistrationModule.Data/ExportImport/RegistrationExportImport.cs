using System;
using System.IO;
using System.Threading.Tasks;
using Newtonsoft.Json;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models.Search;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.ExportImport;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.ExportImport;
public class RegistrationExportImport
{
    private readonly IRegistrationRequestSearchService _registrationRequestSearchService;
    private readonly IRegistrationRequestCrudService _registrationRequestCrudService;
    private readonly JsonSerializer _jsonSerializer;
    private readonly int _batchSize = 50;

    public RegistrationExportImport(
        IRegistrationRequestSearchService registrationRequestSearchService,
        IRegistrationRequestCrudService registrationRequestCrudService,
        JsonSerializer jsonSerializer
        )
    {
        _registrationRequestSearchService = registrationRequestSearchService;
        _registrationRequestCrudService = registrationRequestCrudService;
        _jsonSerializer = jsonSerializer;
    }

    public virtual async Task DoExportAsync(Stream outStream, ExportImportOptions options, Action<ExportImportProgressInfo> progressCallback, ICancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();
        var progressInfo = new ExportImportProgressInfo { Description = "loading data..." };
        progressCallback(progressInfo);

        using (var sw = new StreamWriter(outStream))
        using (var writer = new JsonTextWriter(sw))
        {
            await writer.WriteStartObjectAsync();

            #region Export RegistrationRequests

            progressInfo.Description = "RegistrationRequests exporting...";
            progressCallback(progressInfo);

            await writer.WritePropertyNameAsync("RegistrationRequests");
            await writer.SerializeArrayWithPagingAsync(_jsonSerializer, _batchSize, async (skip, take) =>
            {
                var searchResult = await _registrationRequestSearchService.SearchAsync(new SearchRegistrationRequestCriteria { Skip = skip, Take = take });
                return (GenericSearchResult<RegistrationRequest>)searchResult;
            }
            , (processedCount, totalCount) =>
            {
                progressInfo.Description = $"{processedCount} of {totalCount} registration requests have been exported";
                progressCallback(progressInfo);
            }, cancellationToken);

            #endregion

            await writer.WriteEndObjectAsync();
            await writer.FlushAsync();
        }
    }

    public virtual async Task DoImportAsync(Stream inputStream, ExportImportOptions options, Action<ExportImportProgressInfo> progressCallback, ICancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        var progressInfo = new ExportImportProgressInfo();

        using (var streamReader = new StreamReader(inputStream))
        using (var reader = new JsonTextReader(streamReader))
        {
            while (await reader.ReadAsync())
            {
                if (reader.TokenType != JsonToken.PropertyName)
                {
                    continue;
                }

                switch (reader.Value?.ToString())
                {
                    case "RegistrationRequests":
                        await reader.DeserializeArrayWithPagingAsync<RegistrationRequest>(_jsonSerializer, _batchSize, items => _registrationRequestCrudService.SaveChangesAsync(items), processedCount =>
                        {
                            progressInfo.Description = $"{processedCount} registration requests have been imported";
                            progressCallback(progressInfo);
                        }, cancellationToken);
                        break;
                    default:
                        continue;
                }
            }
        }
    }
}
