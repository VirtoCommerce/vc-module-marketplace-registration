using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.MySql.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultStateMachine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            #region ---------- RegistrationRequestStateMachineDefinition ----------
            var registrationRequestScript = @"INSERT INTO `statemachinedefinition`
                (`Id`, `Name`, `EntityType`, `IsActive`, `Version`, `CreatedDate`, `ModifiedDate`, `CreatedBy`, `ModifiedBy`, `StatesSerialized`)
                SELECT
	                UUID(), 'seller-registration-request-flow', 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest', true, '0', NOW(), NOW(), 'Script', 'Script',
	                '[
                      {
                        ""name"": ""Pending"",
                        ""type"": ""StateMachineState"",
                        ""description"": ""Just submitted registartion request"",
                        ""isInitial"": true,
                        ""isFinal"": false,
                        ""stateData"": {},
                        ""transitions"": [
                          {
                            ""trigger"": ""CompleteRegistrationRequest"",
                            ""description"": ""If you want to accept the request"",
                            ""toState"": ""Completed""
                          },
                          {
                            ""trigger"": ""ProcessRegistrationRequest"",
                            ""description"": ""If you want to process the request but additional steps required"",
                            ""toState"": ""Processing""
                          },
                          {
                            ""trigger"": ""DeclineRegistrationRequest"",
                            ""description"": ""If you want decline the request"",
                            ""toState"": ""Declined""
                          }
                        ]
                      },
                      {
                        ""name"": ""Processing"",
                        ""type"": ""StateMachineState"",
                        ""description"": ""Required additional steps to accept this request"",
                        ""isInitial"": false,
                        ""isFinal"": false,
                        ""stateData"": {},
                        ""transitions"": [
                          {
                            ""trigger"": ""CompleteRegistrationRequest"",
                            ""description"": ""If you want to accept the request"",
                            ""toState"": ""Completed""
                          },
                          {
                            ""trigger"": ""DeclineRegistrationRequest"",
                            ""description"": ""If you want decline the request"",
                            ""toState"": ""Declined""
                          }
                        ]
                      },
                      {
                        ""name"": ""Declined"",
                        ""type"": ""StateMachineState"",
                        ""description"": ""Declined registration request"",
                        ""isInitial"": false,
                        ""isFinal"": true,
                        ""isFailed"": true,
                        ""stateData"": {},
                        ""transitions"": []
                      },
                      {
                        ""name"": ""Completed"",
                        ""type"": ""StateMachineState"",
                        ""description"": ""Registration request converted into a Vendor"",
                        ""isInitial"": false,
                        ""isFinal"": true,
                        ""isSuccess"": true,
                        ""stateData"": {},
                        ""transitions"": []
                      }
                    ]'
                FROM dual
                WHERE NOT EXISTS (SELECT * 
	                FROM `statemachinedefinition` 
	                WHERE `EntityType` = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest')
                ";
            migrationBuilder.Sql(registrationRequestScript);
            #endregion ---------- RegistrationRequestStateMachineDefinition ----------

            #region ---------- RegistrationRequestLocalization ----------
            var localizationSql = @"
                INSERT INTO StateMachineLocalization (Id, DefinitionId, Item, Locale, Value, CreatedDate, CreatedBy)
                SELECT UUID(), d.Id, l.Item, l.Locale, l.Value, NOW(), 'Script'
                FROM StateMachineDefinition d
                JOIN (
                    SELECT 'CompleteRegistrationRequest' AS Item, 'en-US' AS Locale, 'Complete'  AS Value
                    UNION SELECT 'ProcessRegistrationRequest',    'en-US', 'Process'
                    UNION SELECT 'DeclineRegistrationRequest',    'en-US', 'Decline'
                ) l
                LEFT JOIN StateMachineLocalization sl
                    ON sl.DefinitionId = d.Id AND sl.Item = l.Item AND sl.Locale = l.Locale
                WHERE d.EntityType = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'
                  AND d.IsActive = 1
                  AND sl.Id IS NULL
                ";
            migrationBuilder.Sql(localizationSql);
            #endregion ---------- RegistrationRequestLocalization ----------

            #region ---------- RegistrationRequestAttribute ----------
            var attributeSql = @"
                INSERT INTO StateMachineAttribute (Id, DefinitionId, Item, AttributeKey, Value, CreatedDate, CreatedBy)
                SELECT UUID(), d.Id, l.Item, l.AttributeKey, l.Value, NOW(), 'Script'
                FROM StateMachineDefinition d
                JOIN (
                    SELECT 'CompleteRegistrationRequest' AS Item, 'Icon' AS AttributeKey, 'far fa-check-circle' AS Value
                    UNION SELECT 'ProcessRegistrationRequest',    'Icon', 'fas fa-ellipsis-h'
                    UNION SELECT 'DeclineRegistrationRequest',    'Icon', 'fas fa-times-circle'
                ) l
                LEFT JOIN StateMachineAttribute sl
                    ON sl.DefinitionId = d.Id AND sl.Item = l.Item AND sl.AttributeKey = l.AttributeKey
                WHERE d.EntityType = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'
                  AND d.IsActive = 1
                  AND sl.Id IS NULL
                ";
            migrationBuilder.Sql(attributeSql);
            #endregion ---------- RegistrationRequestAttribute ----------

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
