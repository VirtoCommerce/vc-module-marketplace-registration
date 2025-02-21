using System.Collections.Generic;
using System.Linq;
using VirtoCommerce.Platform.Core.Security;
using VirtoCommerce.Platform.Core.Settings;

namespace VirtoCommerce.MarketplaceRegistrationModule.Core;

public static class ModuleConstants
{
    public static class Security
    {
        public static class Permissions
        {
            public const string Read = "seller:registration:read";
            public const string Update = "seller:registration:update";

            public static string[] AllPermissions { get; } =
            {
                Read,
                Update,
            };
        }

        public static class Roles
        {
            public static readonly Role Operator = new()
            {
                Id = "vcmp-operator-role",
                Permissions = new[]
                {
                    Permissions.Read,
                    Permissions.Update
                }
                .Select(x => new Permission { GroupName = "Marketplace", Name = x })
                .ToList()
            };

            public static Role[] AllRoles = { Operator };
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
            public static SettingDescriptor RegistrationFormUrl { get; } = new()
            {
                Name = "RegistrationRequest.RegistrationFormUrl",
                GroupName = "Marketplace RegistrationRequest|General",
                ValueType = SettingValueType.ShortText,
                DefaultValue = "/registration",
            };

            public static IEnumerable<SettingDescriptor> AllGeneralSettings
            {
                get
                {
                    yield return RegistrationFormUrl;
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
