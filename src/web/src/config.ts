
interface iConfig { 
  stage: string;
  baseHref: string;
  apiRoot: string;
  basicAuthKey: string;
  isLocal?: boolean;
  dummyCreds?: { username: string, password: string }
}

const createConfig = (stage: (stageString: string) => Partial<iConfig>): iConfig => {
  const currentStage = process.env.REACT_APP_STAGE;
  
  let baseHref, apiRoot;
  if (currentStage === 'prd') {
    baseHref = `/`;
    apiRoot = `/api/`;
  } else {
    baseHref = `/${currentStage}/`;
    apiRoot = `/${currentStage}/api/`;
  }

  return {
    stage: currentStage,
    baseHref,
    apiRoot,
    ...stage(currentStage)
  } as iConfig;
}

const local: iConfig = createConfig((currentStage) => ({
  basicAuthKey: 'c3NoLXJzYSBBQUFBQjNOemFDMXljMkVBQUFBREFRQUJBQUFCZ1FEWXQwSjlrYi9vRU5tajJCRjU2S0Y1WEpjdWx1dEUxQk8ra3hkbWcwZ2FWS3FDeE5IMlpYODFpYTliaW5QKzZMZU9CQjd4T3QzOVYyd21lQngvbnNjTG50eWdxWEFrbWhGLzNXNm9KandEbThzSFFNM2N2VlVyeXRSK2REQW5KZ084M2x4M1VjV2FPK0hnMUxrRDByNnRSZGk4amdMR05HeDJLWUQrNFpkekF5KzcxYnA2RVhTYnkzTm9jQWpXRk5aV0h4c1BUR05PYnNFZzYyaUNIU2t5QUlTdEJoSG4xMkJuVUFsNmJ6R1AyN2VXRWloMDM3Qkc2c1ZySGZhWHhRMHcrSE5TSFVUSFk3WUtnanp5V21SNVM4TzB0QW9USEFzVnk3MVhlRk13ckJBWVlwV3RrcG5UMElqNTdNQzF1NmpmWHhDeWx5eHM2blpWQ0pyM1pTeVI3WEdPaVltV2pqaG1NS2E0Mm1HRXdGaTJIUU9TV3h6YVVlVS9PRW5SRHBDVDk3cGJtOVp4bmxodjBiVFo0aWNtbEFueEJPemhIM0RjbVRxY2h4UmlEVmJOc3RPTnlLSE13L0U4djBSa2tKZ29nY21jRDJoWkFOZDl5MjBoN05Yd2dodTBKdWFkbUNaQ1ptemhxUFM2RWpGQjNXQkRScnh0RUdDUzc5NHZseEU9',
  isLocal: true,
  dummyCreds: { username: 'am9zaHVh', password: 'dHJlZQ==' },
}));

const dev: iConfig = createConfig((currentStage) => ({
  basicAuthKey: 'c3NoLXJzYSBBQUFBQjNOemFDMXljMkVBQUFBREFRQUJBQUFCZ1FEWXQwSjlrYi9vRU5tajJCRjU2S0Y1WEpjdWx1dEUxQk8ra3hkbWcwZ2FWS3FDeE5IMlpYODFpYTliaW5QKzZMZU9CQjd4T3QzOVYyd21lQngvbnNjTG50eWdxWEFrbWhGLzNXNm9KandEbThzSFFNM2N2VlVyeXRSK2REQW5KZ084M2x4M1VjV2FPK0hnMUxrRDByNnRSZGk4amdMR05HeDJLWUQrNFpkekF5KzcxYnA2RVhTYnkzTm9jQWpXRk5aV0h4c1BUR05PYnNFZzYyaUNIU2t5QUlTdEJoSG4xMkJuVUFsNmJ6R1AyN2VXRWloMDM3Qkc2c1ZySGZhWHhRMHcrSE5TSFVUSFk3WUtnanp5V21SNVM4TzB0QW9USEFzVnk3MVhlRk13ckJBWVlwV3RrcG5UMElqNTdNQzF1NmpmWHhDeWx5eHM2blpWQ0pyM1pTeVI3WEdPaVltV2pqaG1NS2E0Mm1HRXdGaTJIUU9TV3h6YVVlVS9PRW5SRHBDVDk3cGJtOVp4bmxodjBiVFo0aWNtbEFueEJPemhIM0RjbVRxY2h4UmlEVmJOc3RPTnlLSE13L0U4djBSa2tKZ29nY21jRDJoWkFOZDl5MjBoN05Yd2dodTBKdWFkbUNaQ1ptemhxUFM2RWpGQjNXQkRScnh0RUdDUzc5NHZseEU9',
}));

const prod: iConfig = createConfig((currentStage) => ({
  baseHref: `/`,
  apiRoot: `/api/`,
  basicAuthKey: 'c3NoLXJzYSBBQUFBQjNOemFDMXljMkVBQUFBREFRQUJBQUFCZ1FEWXQwSjlrYi9vRU5tajJCRjU2S0Y1WEpjdWx1dEUxQk8ra3hkbWcwZ2FWS3FDeE5IMlpYODFpYTliaW5QKzZMZU9CQjd4T3QzOVYyd21lQngvbnNjTG50eWdxWEFrbWhGLzNXNm9KandEbThzSFFNM2N2VlVyeXRSK2REQW5KZ084M2x4M1VjV2FPK0hnMUxrRDByNnRSZGk4amdMR05HeDJLWUQrNFpkekF5KzcxYnA2RVhTYnkzTm9jQWpXRk5aV0h4c1BUR05PYnNFZzYyaUNIU2t5QUlTdEJoSG4xMkJuVUFsNmJ6R1AyN2VXRWloMDM3Qkc2c1ZySGZhWHhRMHcrSE5TSFVUSFk3WUtnanp5V21SNVM4TzB0QW9USEFzVnk3MVhlRk13ckJBWVlwV3RrcG5UMElqNTdNQzF1NmpmWHhDeWx5eHM2blpWQ0pyM1pTeVI3WEdPaVltV2pqaG1NS2E0Mm1HRXdGaTJIUU9TV3h6YVVlVS9PRW5SRHBDVDk3cGJtOVp4bmxodjBiVFo0aWNtbEFueEJPemhIM0RjbVRxY2h4UmlEVmJOc3RPTnlLSE13L0U4djBSa2tKZ29nY21jRDJoWkFOZDl5MjBoN05Yd2dodTBKdWFkbUNaQ1ptemhxUFM2RWpGQjNXQkRScnh0RUdDUzc5NHZseEU9'
}));

let conf;
switch (process.env.REACT_APP_STAGE) {
  case ('dev'): 
    conf = dev;
    break;
  case ('prd'):
    conf = prod;
    break;
  default:
    conf = local;
}

export const config = conf;