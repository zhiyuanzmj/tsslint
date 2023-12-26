import type {
	CodeFixAction,
	DiagnosticWithLocation,
	FileTextChanges,
	LanguageService,
	LanguageServiceHost,
	SourceFile,
} from 'typescript/lib/tsserverlibrary';

export interface ProjectContext {
	configFile: string;
	typescript: typeof import('typescript/lib/tsserverlibrary.js');
	languageServiceHost: LanguageServiceHost;
	languageService: LanguageService;
	tsconfig: string;
}

export interface Config {
	debug?: boolean;
	rules?: Rules;
	plugins?: Plugin[];
}

export interface Plugin {
	(projectContext: ProjectContext): PluginInstance;
}

export interface PluginInstance {
	resolveRules?(rules: Rules): Rules;
	resolveDiagnostics?(fileName: string, results: DiagnosticWithLocation[]): DiagnosticWithLocation[];
	resolveCodeFixes?(fileName: string, results: CodeFixAction[]): CodeFixAction[];
}

export interface Rules {
	[name: string]: Rule;
}

export interface Rule {
	(context: RuleContext): void;
}

export interface RuleContext {
	typescript: typeof import('typescript/lib/tsserverlibrary.js');
	languageServiceHost: LanguageServiceHost;
	languageService: LanguageService;
	sourceFile: SourceFile;
	reportError(message: string, start: number, end: number, trace?: boolean): Reporter;
	reportWarning(message: string, start: number, end: number, trace?: boolean): Reporter;
	reportSuggestion(message: string, start: number, end: number, trace?: boolean): Reporter;
}

export interface Reporter {
	withDeprecated(): Reporter;
	withUnnecessary(): Reporter;
	withFix(title: string, getChanges: () => FileTextChanges[]): Reporter;
}
