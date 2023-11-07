import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import classNames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Chip from '@material-ui/core/Chip';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { injectIntl, intlShape } from 'react-intl';
import Icon from '@material-ui/core/Icon';
import Badge from '@material-ui/core/Badge';
import messages from 'enl-api/ui/menuMessages';
import styles from './sidebar-jss';
import { userCount } from '../../containers/UserSettings/UserList/userListActions';

const LinkBtn = React.forwardRef(function LinkBtn(props, ref) { // eslint-disable-line
  return <NavLink to={props.to} {...props} innerRef={ref} />; // eslint-disable-line
});

class MainMenu extends React.Component { // eslint-disable-line
  constructor(props) {
    super(props);
    this.state = {
      userUpdate: false
    };
  }

  componentDidMount() {
    const { handleGetUserCount } = this.props;
    handleGetUserCount();
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const {
      userCountLoading,
      handleGetUserCount
    } = nextProps;
    const { userUpdate } = preState;
    const updateState = {};
    if (!userUpdate && userCountLoading) {
      handleGetUserCount();
      updateState.userUpdate = true;
    }
    if (!userCountLoading) {
      updateState.userUpdate = false;
    }
    return updateState;
  }


  handleClick() {
    const { toggleDrawerOpen, loadTransition } = this.props;
    toggleDrawerOpen();
    loadTransition(false);
  }

  render() {
    const {
      classes,
      openSubMenu,
      open,
      dataMenu,
      intl,
      userCountValue
    } = this.props;
    const getMenus = menuArray => menuArray.map((item, index) => {
      if (item.child) {
        return (
          <div key={index.toString()}>
            <ListItem
              button
              style={{ paddingLeft: item.isNestedChild ? 40 : 10 }}
              className={
                classNames(
                  classes.head,
                  item.icon ? classes.iconed : '',
                  open.indexOf(item.key) > -1 ? classes.opened : '',
                )
              }
              onClick={() => openSubMenu(item.key, item.keyParent)}
            >
              {item.icon && (
                <ListItemIcon className={classes.icon}>
                  <Icon>{item.icon}</Icon>
                </ListItemIcon>
              )}
              <ListItemText
                classes={{ primary: classes.primary }}
                variant="inset"
                primary={
                  messages[item.key] !== undefined
                    ? intl.formatMessage(messages[item.key])
                    : item.name
                }
              />
              { open.indexOf(item.key) > -1 ? <ExpandLess /> : <ExpandMore /> }
            </ListItem>
            <Collapse
              component="div"
              className={classNames(
                classes.nolist,
                (item.keyParent ? classes.child : ''),
              )}
              in={open.indexOf(item.key) > -1}
              timeout="auto"
              unmountOnExit
            >
              <List className={classes.dense} component="nav" dense>
                { getMenus(item.child, 'key') }
              </List>
            </Collapse>
          </div>
        );
      }
      if (item.title) {
        return (
          <ListItem
            key={index.toString()}
            className={classes.nested}
            style={{ paddingLeft: 40 }}
          >
            {item.icon && (
              <ListItemIcon className={classes.icon}>
                <Icon>{item.icon}</Icon>
              </ListItemIcon>
            )}
            <ListItemText
              classes={{ primary: classes.subHeader }}
              primary={
                messages[item.key] !== undefined
                  ? intl.formatMessage(messages[item.key])
                  : item.name
              }
            />
          </ListItem>
        );
      }
      return (
        <ListItem
          key={index.toString()}
          button
          exact
          className={classes.nested}
          activeClassName={classes.active}
          component={LinkBtn}
          to={item.link}
          onClick={() => this.handleClick()}
          style={item.name === 'Dashboard' ? { paddingLeft: 0 } : {}}
        >
          {item.icon && (
            <ListItemIcon style={{ paddingLeft: 0 }} className={classes.icon}>
              <Icon>{item.icon}</Icon>
            </ListItemIcon>
          )}
          <ListItemText
            classes={{ primary: classes.primary }}
            variant="inset"
            primary={
              messages[item.key] !== undefined
                ? intl.formatMessage(messages[item.key])
                : item.name
            }
          />
          {item.link === '/user-settings/user-register-request' ? (<Badge color="primary" badgeContent={userCountValue} style={{ left: 0 }} className={classes.margin} />) : null }
          {item.badge && (
            <Chip color="primary" label={item.badge} className={classes.badge} />
          )}
        </ListItem>
      );
    });
    return (
      <div>
        {getMenus(dataMenu)}
      </div>
    );
  }
}

MainMenu.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.object.isRequired,
  openSubMenu: PropTypes.func.isRequired,
  toggleDrawerOpen: PropTypes.func.isRequired,
  loadTransition: PropTypes.func.isRequired,
  dataMenu: PropTypes.array.isRequired,
  intl: intlShape.isRequired,
  handleGetUserCount: PropTypes.func.isRequired,
  userCountValue: PropTypes.number.isRequired
};

const openAction = (key, keyParent) => ({ type: 'OPEN_SUBMENU', key, keyParent });
const reducer = 'ui';

const userListReducer = 'userListReducer';

const mapStateToProps = state => ({
  force: state, // force active class for sidebar menu
  open: state.getIn([reducer, 'subMenuOpen']),
  userCountValue: state.get(userListReducer) && state.get(userListReducer).userCount ? state.get(userListReducer).userCount : 0,
  userCountLoading: state.get(userListReducer) && state.get(userListReducer).loading ? state.get(userListReducer).loading : false
});

const mapDispatchToProps = dispatch => ({
  openSubMenu: bindActionCreators(openAction, dispatch),
  handleGetUserCount: bindActionCreators(userCount, dispatch)
});

const MainMenuMapped = connect(
  mapStateToProps,
  mapDispatchToProps
)(MainMenu);

export default withStyles(styles)(injectIntl(MainMenuMapped));
