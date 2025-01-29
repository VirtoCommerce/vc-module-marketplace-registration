using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace VirtoCommerce.MarketplaceRegistrationModule.Data.SqlServer.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultStateMachine : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            #region ---------- RegistrationRequestStateMachineDefinition ----------
            var registrationRequestScript = @"DECLARE @RegistrationRequestStateMachineDefinitionId nvarchar(100)

                SET @RegistrationRequestStateMachineDefinitionId = ''
                SELECT @RegistrationRequestStateMachineDefinitionId = [Id] FROM [dbo].[StateMachineDefinition] WHERE [EntityType] = 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest'

                IF @RegistrationRequestStateMachineDefinitionId = ''
                    BEGIN
                        INSERT INTO [dbo].[StateMachineDefinition]
                            ([Id], [StatesSerialized], [Name], [EntityType], [IsActive], [Version], [CreatedDate], [CreatedBy])
                    VALUES
                        (CONVERT(varchar(128), NEWID()),
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
                            ]',
                        'seller-registration-request-flow', 'VirtoCommerce.MarketplaceRegistrationModule.Core.Models.RegistrationRequest', 1, '0', GETDATE(), 'Script')
		   
                        END";
            migrationBuilder.Sql(registrationRequestScript);
            #endregion ---------- RegistrationRequestStateMachineDefinition ----------
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
