using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Models;
using VirtoCommerce.Platform.Core.Common;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Repositories;
public interface IRegistrationRepository : IRepository
{
    IQueryable<RegistrationRequestEntity> RegistrationRequests { get; }

    Task<IList<RegistrationRequestEntity>> GetRegistrationRequestByIdsAsync(IList<string> ids, string responseGroup = null);
}
