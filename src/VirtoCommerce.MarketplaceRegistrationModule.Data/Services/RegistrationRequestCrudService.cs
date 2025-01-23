using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Models;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Repositories;
using VirtoCommerce.Platform.Core.Caching;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Core.Events;
using VirtoCommerce.Platform.Data.GenericCrud;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Services;
public class RegistrationRequestCrudService : CrudService<RegistrationRequest, RegistrationRequestEntity,
    GenericChangedEntryEvent<RegistrationRequest>, GenericChangedEntryEvent<RegistrationRequest>>,
    IRegistrationRequestCrudService
{
    private readonly Func<IRegistrationRepository> _repositoryFactory;

    public RegistrationRequestCrudService(
        Func<IRegistrationRepository> repositoryFactory,
        IPlatformMemoryCache platformMemoryCache,
        IEventPublisher eventPublisher
        ) : base(repositoryFactory, platformMemoryCache, eventPublisher)
    {
        _repositoryFactory = repositoryFactory;
    }

    protected override Task<IList<RegistrationRequestEntity>> LoadEntities(IRepository repository, IList<string> ids, string responseGroup)
    {
        return ((IRegistrationRepository)repository).GetRegistrationRequestByIdsAsync(ids, responseGroup);
    }
}
