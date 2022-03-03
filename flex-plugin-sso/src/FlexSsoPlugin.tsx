import React from 'react';
import * as Flex from '@twilio/flex-ui';
import { FlexPlugin } from '@twilio/flex-plugin';
import SideBarButton from './components/SideBarButton';
import Panel from './components/Panel';
import { View, withTaskContext } from '@twilio/flex-ui';
import { withTheme } from '@twilio-paste/core/dist/theme';

const PLUGIN_NAME = 'FlexSsoPlugin';

export default class FlexSsoPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  private isSupervisor(manager: Flex.Manager) {
    // admin role is when you log on Flex from Twilio Console
    const { attributes } = manager.workerClient;
    if (attributes.roles.includes('admin')) {
      return true;
    }

    // check if the supervisor has "canAddAgents" flag.
    if (attributes.roles.includes('supervisor') && attributes.canAddAgents) {
      return true;
    }

    return false;
  }

  private registerAlerts(flex: typeof Flex, manager: Flex.Manager) {
    (manager.strings as any).ssoError = 'SSO Plugin Error: {{msg}}';
    (manager.strings as any).ssoOK = '{{msg}}';

    flex.Notifications.registerNotification({
      id: 'ssoError',
      content: 'ssoError',
      type: flex.NotificationType.error,
    });

    flex.Notifications.registerNotification({
      id: 'ssoOK',
      content: 'ssoOK',
      type: flex.NotificationType.success,
    });
  }

  init(flex: typeof Flex, manager: Flex.Manager) {
    flex.AgentDesktopView.Panel2.Content.remove('container');
    flex.AgentDesktopView.Panel2.Content.add(<CustomCRM key="custom_crm" />);

    if (!this.isSupervisor(manager)) {
      return;
    }

    flex.SideNav.Content.add(<SideBarButton key="access-overview-button" />, {
      // if: () => this.isSupervisor(manager),
    });

    flex.ViewCollection.Content.add(
      <View name="access-overview" key="access-overview">
        <Panel key="SsoPage" />
      </View>
    );

    this.registerAlerts(flex, manager);
  }
}

const CustomCRM = withTaskContext(
  withTheme((props: any) => {
    const { task } = props;

    if (task && task.attributes) {
      return (
        <div>
          <h1>test anton</h1>
          <br />
          <br />
          <br />
          <iframe title="CRMContainer" key="iframe" src="https://bing.com" height="100%" />
        </div>
      );
    }

    return null;
  })
);
