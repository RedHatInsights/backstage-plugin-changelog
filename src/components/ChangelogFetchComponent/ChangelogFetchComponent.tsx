import React from 'react';
import { Table, TableColumn, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';

type Change = {
  commit: string;
  merged_at: string; // TODO: Timezone
  change_types: string[];
  error: boolean;
  apps: string[];
}

type DenseTableProps = {
  changes: Change[];
};

export const DenseTable = ({ changes }: DenseTableProps) => {
  const columns: TableColumn[] = [
    { title: 'Commit', field: 'commit' },
    { title: 'Merged At', field: 'merged_at' },
    { title: 'Error', field: 'error' },
    { title: 'Change Types', field: 'change_types' },
    { title: 'Apps', field: 'apps' },
  ];

  const data = changes.map(change => {
    change.change_types = [change.change_types.join(", ")];
    change.apps = [change.apps.join(", ")];

    return change;
  })

  return (
    <Table
      title="Example Changelog"
      options={{ search: true, paging: true }}
      columns={columns}
      data={data}
    />
  );
};

export const ChangelogFetchComponent = () => {
  const config = useApi(configApiRef);
  const { value, loading, error } = useAsync(async (): Promise<Change[]> => {
    const response = await fetch(`${config.getString('backend.baseUrl')}/api/proxy/inscope-resources/resources/json/change-log.json`)
      .catch(e => e)
      .then(resp => resp);
    if (!response.ok) {
      // TODO: Return error
    }
    const changes = await response.text();
    console.log(changes);

    //
    // let config_map;
    // try {
    //   config_map = parse(changes);
    // } catch {
    //   // TODO: Return error
    // }
    // console.log(config_map);

    let change_data;
    try {
      change_data = JSON.parse(changes);
    } catch {
      // TODO: Return error
    }
    console.log(change_data);

    return change_data.items;
  }, []);

  if (loading) {
    return <Progress />;
  } else if (error) {
    return <ResponseErrorPanel error={error} />;
  }

  return <DenseTable changes={value || []} />;
};
