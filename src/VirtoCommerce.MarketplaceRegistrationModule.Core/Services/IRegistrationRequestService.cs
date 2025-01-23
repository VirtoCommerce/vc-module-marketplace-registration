using System.Threading.Tasks;
using VirtoCommerce.MarketplaceRegistrationModule.Core.Models;

namespace VirtoCommerce.MarketplaceRegistrationModule.Core.Services;
public interface IRegistrationRequestService
{
    Task<RegistrationRequest> CreateRegistrationRequest(RegistrationRequestDetails registrationRequestDetails);
}
