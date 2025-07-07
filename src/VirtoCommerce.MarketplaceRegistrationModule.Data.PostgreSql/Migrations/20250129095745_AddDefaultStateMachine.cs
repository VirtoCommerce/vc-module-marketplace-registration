using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.PostgreSql.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultStateMachine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            #region ---------- RegistrationRequestStateMachineDefinition ----------
            var registrationRequestScript = @"DO $$
                DECLARE 
                    RegistrationRequestStateMachineDefinitionId VARCHAR(100);
                BEGIN
	                RegistrationRequestStateMachineDefinitionId := '';

                    SELECT ""Id"" INTO RegistrationRequestStateMachineDefinitionId 
                    FROM public.""StateMachineDefinition"" 
                    WHERE ""EntityType"" = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest';
	
                    IF RegistrationRequestStateMachineDefinitionId IS NULL THEN
		                INSERT INTO public.""StateMachineDefinition""(
			                ""Id"", ""Name"", ""EntityType"", ""IsActive"", ""Version"", ""CreatedDate"", ""ModifiedDate"", ""CreatedBy"", ""ModifiedBy"", ""StatesSerialized"")
		                VALUES (gen_random_uuid(), 'seller-registration-request-flow', 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest', true, '0', NOW(), NOW(), 'Script', 'Script', 
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
                        ]');
                    END IF;
                END $$;
                ";
            migrationBuilder.Sql(registrationRequestScript);
            #endregion ---------- RegistrationRequestStateMachineDefinition ----------

            #region ---------- RegistrationRequestLocalization ----------
            var registrationRequestLocalizationSql = @"
            INSERT INTO ""StateMachineLocalization""
                (""Id"",""DefinitionId"",""Item"",""Locale"",""Value"",""CreatedDate"",""CreatedBy"")
            SELECT
                gen_random_uuid(),
                def.""Id"",
                t.""Item"",
                t.""Locale"",
                t.""Value"",
                now(),
                'Script'
            FROM (
                VALUES
                  ('CompleteRegistrationRequest',   'en-US', 'Complete'),
                  ('ProcessRegistrationRequest',    'en-US', 'Process'),
                  ('DeclineRegistrationRequest',    'en-US', 'Decline')
            ) AS t(""Item"",""Locale"",""Value"")
            JOIN ""StateMachineDefinition"" def
              ON def.""EntityType"" = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'
             AND def.""IsActive""   = TRUE
            -- If the definition doesn’t exist yet (e.g. somebody disabled it), no rows will be inserted
            ;
            ";
            migrationBuilder.Sql(registrationRequestLocalizationSql);
            #endregion ---------- RegistrationRequestLocalization ----------

            #region ---------- RegistrationRequestAttribute ----------
            var registrationRequestAttributeSql = @"
            INSERT INTO ""StateMachineAttribute""
                (""Id"",""DefinitionId"",""Item"",""AttributeKey"",""Value"",""CreatedDate"",""CreatedBy"")
            SELECT
                gen_random_uuid(),
                def.""Id"",
                t.""Item"",
                t.""AttributeKey"",
                t.""Value"",
                now(),
                'Script'
            FROM (
                VALUES
                  ('CompleteRegistrationRequest',   'Icon', 'far fa-check-circle'),
                  ('ProcessRegistrationRequest',    'Icon', 'fas fa-ellipsis-h'),
                  ('DeclineRegistrationRequest',    'Icon', 'fas fa-times-circle')
            ) AS t(""Item"",""AttributeKey"",""Value"")
            JOIN ""StateMachineDefinition"" def
              ON def.""EntityType"" = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'
             AND def.""IsActive""   = TRUE
            -- If the definition doesn’t exist yet (e.g. somebody disabled it), no rows will be inserted
            ;
            ";
            migrationBuilder.Sql(registrationRequestAttributeSql);
            #endregion ---------- RegistrationRequestAttribute ----------

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
