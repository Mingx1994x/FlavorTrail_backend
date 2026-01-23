type TWebConfig = {
  port: string;
};

type TJwtConfig = {
  secret: string;
  expiresDay: string | number;
};

export type TCredentialsConfig = {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
};

type TGoogleSheetConfig = {
  spreadsheet_id: string;
};

export type TConfig = {
  web: TWebConfig;
  jwt: TJwtConfig;
  credentials: TCredentialsConfig;
  sheets: TGoogleSheetConfig;
};
