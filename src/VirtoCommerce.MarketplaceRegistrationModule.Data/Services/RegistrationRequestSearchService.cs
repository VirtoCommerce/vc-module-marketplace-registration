using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.Options;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models.Search;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Repositories;
using VirtoCommerce.Platform.Core.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.GenericCrud;
using VirtoCommerce.Platform.Data.GenericCrud;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Services;
public class RegistrationRequestSearchService : SearchService<SearchRegistrationRequestCriteria,
    SearchRegistrationRequestResult, RegistrationRequest, RegistrationRequestEntity>,
    IRegistrationRequestSearchService
{
    public RegistrationRequestSearchService(
    Func<IRegistrationRepository> repositoryFactory,
    IPlatformMemoryCache platformMemoryCache,
    IRegistrationRequestCrudService crudService,
    IOptions<CrudOptions> crudOptions
    )
    : base(repositoryFactory, platformMemoryCache, crudService, crudOptions)
    {
    }

    protected override IQueryable<RegistrationRequestEntity> BuildQuery(IRepository repository, SearchRegistrationRequestCriteria criteria)
    {
        var query = ((IRegistrationRepository)repository).RegistrationRequests;

        if (!string.IsNullOrEmpty(criteria.Keyword))
        {
            query = query.Where(x => x.FirstName.Contains(criteria.Keyword)
            || x.LastName.Contains(criteria.Keyword)
            || x.OrganizationName.Contains(criteria.Keyword)
            || x.ContactEmail.Contains(criteria.Keyword)
            || x.ContactPhone.Contains(criteria.Keyword));
        }

        if (!string.IsNullOrEmpty(criteria.ContactEmail))
        {
            query = query.Where(x => x.ContactEmail == criteria.ContactEmail);
        }

        if (!criteria.Statuses.IsNullOrEmpty())
        {
            query = query.Where(x => criteria.Statuses.Contains(x.Status));
        }

        return query;
    }

    protected override IList<SortInfo> BuildSortExpression(SearchRegistrationRequestCriteria criteria)
    {
        var sortInfos = criteria.SortInfos;
        if (sortInfos.IsNullOrEmpty())
        {
            sortInfos = [
                    new SortInfo
                    {
                        SortColumn = ReflectionUtility.GetPropertyName<RegistrationRequestEntity>(x => x.CreatedDate),
                        SortDirection = SortDirection.Descending
                    }
                ];
        }

        return sortInfos;
    }

}
