using VirtoCommerce.Platform.Core.PushNotifications;

namespace VirtoCommerce.MarketplaceRegistrationModule.Core.PushNotifications;
public class RegistrationRequestPushNotification : PushNotification
{
    public RegistrationRequestPushNotification(string creator)
        : base(creator)
    {
    }

    public string RegistrationRequestId { get; set; }
}
