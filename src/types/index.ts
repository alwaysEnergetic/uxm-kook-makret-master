export interface IAppConfig {
  siteTitle: string;
  appName: string;
  domain: string;
  logoUrl: string;
  apiHost: string;
  recaptchaSiteKey: string;
  domainInfoSite: string;
  domainSeller: string;
  domainMusic: string;
}

export interface LayoutProps {
	className?: string;
  children?: React.ReactNode;
}

type AuthenticateValues = "Private" | "Public" | "Any"

export interface LayoutContainerProps {
  ChildComponent: React.ComponentType;
  authenticate?: AuthenticateValues;
  roles?: string[];
  capabilites?: string[];
  layoutName?: string;
  layoutProps?: LayoutProps;
  title?: string; // page title
}