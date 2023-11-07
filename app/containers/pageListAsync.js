import Loadable from 'react-loadable';
import Loading from 'enl-components/Loading';

export const DashboardPage = Loadable({
  loader: () => import('./Pages/Dashboard'),
  loading: Loading,
});
export const Table = Loadable({
  loader: () => import('./Pages/Table/BasicTable'),
  loading: Loading,
});
export const Form = Loadable({
  loader: () => import('./Pages/Forms/ReduxForm'),
  loading: Loading,
});
export const Login = Loadable({
  loader: () => import('./Login'),
  loading: Loading,
});
export const ComingSoon = Loadable({
  loader: () => import('./Pages/ComingSoon'),
  loading: Loading,
});
export const BlankPage = Loadable({
  loader: () => import('./Pages/BlankPage'),
  loading: Loading,
});
export const NotFound = Loadable({
  loader: () => import('./NotFound/NotFound'),
  loading: Loading,
});
export const Error = Loadable({
  loader: () => import('./Pages/Error'),
  loading: Loading,
});
export const Maintenance = Loadable({
  loader: () => import('./Pages/Maintenance'),
  loading: Loading,
});
export const Parent = Loadable({
  loader: () => import('./Parent'),
  loading: Loading,
});
export const NotFoundDedicated = Loadable({
  loader: () => import('./Pages/Standalone/NotFoundDedicated'),
  loading: Loading,
});
export const UserRegisterRequest = Loadable({
  loader: () => import('./UserSettings/UserRegisterRequest'),
  loading: Loading,
});
export const CreateUser = Loadable({
  loader: () => import('./UserSettings/CreateUser'),
  loading: Loading,
});
export const UserList = Loadable({
  loader: () => import('./UserSettings/UserList'),
  loading: Loading,
});
export const TransferRequests = Loadable({
  loader: () => import('./UserSettings/TransferRequests'),
  loading: Loading,
});
export const TransferLogs = Loadable({
  loader: () => import('./UserSettings/TransferLogs'),
  loading: Loading,
});
export const UserStatusLogs = Loadable({
  loader: () => import('./UserSettings/UserStatusLogs'),
  loading: Loading,
});
export const ResetPasswordNewLogin = Loadable({
  loader: () => import('./Pages/ResetPassword'),
  loading: Loading,
});