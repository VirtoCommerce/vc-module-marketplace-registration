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
                                ""toState"": ""Completed"",
                                ""icon"": ""far fa-check-circle""
                              },
                              {
                                ""trigger"": ""ProcessRegistrationRequest"",
                                ""description"": ""If you want to process the request but additional steps required"",
                                ""toState"": ""Processing"",
                                ""icon"": ""fas fa-ellipsis-h""
                              },
                              {
                                ""trigger"": ""DeclineRegistrationRequest"",
                                ""description"": ""If you want decline the request"",
                                ""toState"": ""Declined"",
                                ""icon"": ""fas fa-times-circle""
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
                                ""toState"": ""Completed"",
                                ""icon"": ""far fa-check-circle""
                              },
                              {
                                ""trigger"": ""DeclineRegistrationRequest"",
                                ""description"": ""If you want decline the request"",
                                ""toState"": ""Declined"",
                                ""icon"": ""fas fa-times-circle""
                              }
                            ]
                          },
                          {
                            ""name"": ""Declined"",
                            ""type"": ""StateMachineState"",
                            ""description"": ""Declined registration request"",
                            ""isInitial"": false,
                            ""isFinal"": true,
                            ""stateData"": {},
                            ""transitions"": []
                          },
                          {
                            ""name"": ""Completed"",
                            ""type"": ""StateMachineState"",
                            ""description"": ""Registration request converted into a Vendor"",
                            ""isInitial"": false,
                            ""isFinal"": true,
                            ""stateData"": {},
                            ""transitions"": []
                          }
                        ]');
                    END IF;
                END $$;
                ";
            migrationBuilder.Sql(registrationRequestScript);
            #endregion ---------- RegistrationRequestStateMachineDefinition ----------
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
