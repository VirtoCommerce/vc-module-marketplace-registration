using System.Collections.Generic;
using VirtoCommerce.Platform.Core.Settings;

namespace VirtoCommerce.MarketplaceRegistrationModule.Core;

public static class ModuleConstants
{
    public static class Security
    {
        public static class Permissions
        {
            public const string Access = "MarketplaceRegistrationModule:access";
            public const string Create = "MarketplaceRegistrationModule:create";
            public const string Read = "MarketplaceRegistrationModule:read";
            public const string Update = "MarketplaceRegistrationModule:update";
            public const string Delete = "MarketplaceRegistrationModule:delete";

            public static string[] AllPermissions { get; } =
            {
                Access,
                Create,
                Read,
                Update,
                Delete,
            };
        }
    }

    public static class StateMachineObjectType
    {
        public const string RegistrationRequest = "VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest";
    }

    public static class Settings
    {
        public static class General
        {
            public static SettingDescriptor MarketplaceRegistrationModuleEnabled { get; } = new()
            {
                Name = "MarketplaceRegistrationModule.MarketplaceRegistrationModuleEnabled",
                GroupName = "MarketplaceRegistrationModule|General",
                ValueType = SettingValueType.Boolean,
                DefaultValue = false,
            };

            public static SettingDescriptor MarketplaceRegistrationModulePassword { get; } = new()
            {
                Name = "MarketplaceRegistrationModule.MarketplaceRegistrationModulePassword",
                GroupName = "MarketplaceRegistrationModule|Advanced",
                ValueType = SettingValueType.SecureString,
                DefaultValue = "qwerty",
            };

            public static IEnumerable<SettingDescriptor> AllGeneralSettings
            {
                get
                {
                    yield return MarketplaceRegistrationModuleEnabled;
                    yield return MarketplaceRegistrationModulePassword;
                }
            }
        }

        public static IEnumerable<SettingDescriptor> AllSettings
        {
            get
            {
                return General.AllGeneralSettings;
            }
        }
    }
}
