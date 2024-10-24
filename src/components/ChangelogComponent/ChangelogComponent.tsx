import React from 'react';
import { Grid } from '@material-ui/core';

import {
  Header,
  Page,
  Content,
  ContentHeader,
  HeaderLabel,
  SupportButton,
} from '@backstage/core-components';
import { ChangelogFetchComponent } from '../ChangelogFetchComponent';

export const ChangelogComponent = () => (
  <Page themeId="tool">
    <Header title="Welcome to changelog!" subtitle="A log of changes">
      <HeaderLabel label="Owner" value="Team X" />
      <HeaderLabel label="Lifecycle" value="Alpha" />
    </Header>
    <Content>
      <ContentHeader title="Changelog">
        <SupportButton>A log of changes.</SupportButton>
      </ContentHeader>
      <Grid container spacing={3} direction="column">
        <Grid item>
          <ChangelogFetchComponent />
        </Grid>
      </Grid>
    </Content>
  </Page>
);
        // <Grid item>
        //   <InfoCard title="Information card">
        //     <Typography variant="body1">
        //       All content should be wrapped in a card like this.
        //     </Typography>
        //   </InfoCard>
        // </Grid>
        // <Grid item>
        //   <ExampleFetchComponent />
        // </Grid>
