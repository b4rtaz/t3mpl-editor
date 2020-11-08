
export interface TemplateSource {
	type: TemplateSourceType;
	manifestUrl?: string;
	websiteUrl?: string;
}

export type TemplateSourceType = 'file' | 'remoteTemplate' | 'server';
