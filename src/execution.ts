// (C) 2007-2018 GoodData Corporation
import { ExperimentalExecutionsModule } from "./execution/experimental-executions";
import { AttributesMapLoaderModule } from "./utils/attributesMapLoader";
import { ExecuteAfmModule } from "./execution/execute-afm";
import { XhrModule } from "./xhr";
import { MetadataModule } from "./metadata";

/**
 * Execution endpoints
 *
 * @module execution
 * @class execution
 *
 */
export class ExecutionModule {
    public readonly executeAfm: ExecuteAfmModule["executeAfm"];
    public readonly getExecutionResponse: ExecuteAfmModule["getExecutionResponse"];
    public readonly getPartialExecutionResult: ExecuteAfmModule["getPartialExecutionResult"];
    public readonly getExecutionResult: ExecuteAfmModule["getExecutionResult"];
    private readonly executeAfmModule: ExecuteAfmModule;
    private readonly xhr: XhrModule;
    private readonly md: MetadataModule;

    constructor(xhr: XhrModule, md: MetadataModule) {
        this.executeAfmModule = new ExecuteAfmModule(xhr);
        this.executeAfm = this.executeAfmModule.executeAfm.bind(this.executeAfmModule);
        this.getExecutionResponse = this.executeAfmModule.getExecutionResponse.bind(this.executeAfmModule);
        this.getPartialExecutionResult = this.executeAfmModule.getPartialExecutionResult.bind(
            this.executeAfmModule,
        );
        this.getExecutionResult = this.executeAfmModule.getExecutionResult.bind(this.executeAfmModule);
        this.xhr = xhr;
        this.md = md;
    }

    public getData(projectId: string, columns: any[], executionConfiguration: any = {}, settings: any = {}) {
        return this.getExperimentalExecutionsModule().getData(
            projectId,
            columns,
            executionConfiguration,
            settings,
        );
    }

    public mdToExecutionDefinitionsAndColumns(projectId: string, mdObj: any, options = {}) {
        return this.getExperimentalExecutionsModule().mdToExecutionDefinitionsAndColumns(
            projectId,
            mdObj,
            options,
        );
    }

    private getExperimentalExecutionsModule() {
        const loaderModule = new AttributesMapLoaderModule(this.md);

        return new ExperimentalExecutionsModule(this.xhr, loaderModule.loadAttributesMap.bind(loaderModule));
    }
}
