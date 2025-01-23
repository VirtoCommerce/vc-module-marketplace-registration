using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using VirtoCommerce.MarketplaceRegistrationModule.Data.Models;
using VirtoCommerce.Platform.Core.Common;
using VirtoCommerce.Platform.Data.Infrastructure;

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.Repositories;
public class RegistrationRepository : DbContextRepositoryBase<RegistrationDbContext>, IRegistrationRepository
{
    public RegistrationRepository(RegistrationDbContext dbContext)
    : base(dbContext)
    {
    }

    public IQueryable<RegistrationRequestEntity> RegistrationRequests => DbContext.Set<RegistrationRequestEntity>();

    public virtual async Task<IList<RegistrationRequestEntity>> GetRegistrationRequestByIdsAsync(IList<string> ids, string responseGroup = null)
    {
        var result = Array.Empty<RegistrationRequestEntity>();

        if (!ids.IsNullOrEmpty())
        {
            result = await RegistrationRequests.Where(x => ids.Contains(x.Id)).ToArrayAsync();
        }

        return result;
    }

}
