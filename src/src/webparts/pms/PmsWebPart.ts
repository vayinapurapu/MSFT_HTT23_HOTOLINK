import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'PmsWebPartStrings';
import Pms from './components/Pms';
import { IPmsProps } from './components/IPmsProps';
import { initializeIcons } from 'office-ui-fabric-react';

export interface IPmsWebPartProps {
  description: string;
}

initializeIcons();
export default class PmsWebPart extends BaseClientSideWebPart<IPmsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPmsProps> = React.createElement(
      Pms,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  // protected onInit(): Promise<void> {
  // }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
