import React from 'react';
import { Table, TableColumn, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi, configApiRef } from '@backstage/core-plugin-api';
import useAsync from 'react-use/lib/useAsync';
import { parse } from 'yaml';

export const exampleChanges = {
  "results": [
    {
      "commit": "cf76ba0c6762fe88978e6f13baba0f66d1bfe4a2",
      "merged_at": "2024-10-14T12:54:58.356Z",
      "change_types": [
        "progressive-delivery",
        "saas-file-promotion"
      ],
      "error": false,
      "apps": [
        "osd-fleet-manager"
      ]
    },
    {
      "commit": "4b2af42ddd6224dbadcb5ee7241f1cc383048edc",
      "merged_at": "2024-10-14T12:48:32.806Z",
      "change_types": [
        "resource-rds-defaults-updates",
        "resource-updates",
        "namespace-external-resources-updates"
      ],
      "error": false,
      "apps": [
        "Glitchtip"
      ]
    },
    {
      "commit": "e0e8a459c47ff183b10cea9f5033231abd401c56",
      "merged_at": "2024-10-14T12:45:27.021Z",
      "change_types": [
        "saas-file-promotion"
      ],
      "error": false,
      "apps": [
        "osd-fleet-manager"
      ]
    },
    {
      "commit": "fdbb5159b5e71d5d1ed2a3798d01dbd285a96108",
      "merged_at": "2024-10-14T12:41:43.941Z",
      "change_types": [
        "resource-rds-defaults-updates",
        "resource-updates",
        "namespace-external-resources-updates"
      ],
      "error": false,
      "apps": [
        "Glitchtip"
      ]
    },
    {
      "commit": "364a564a14a7e2c8233ef40d69017597248d140e",
      "merged_at": "2024-10-14T12:37:49.661Z",
      "change_types": [
        "progressive-delivery",
        "saas-file-promotion"
      ],
      "error": false,
      "apps": [
        "assisted-installer"
      ]
    }
  ]
}

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
    // TODO: fetch
    const response = await fetch(`${config.getString('backend.baseUrl')}/api/proxy/inscope-resources/resources/yaml/configmap-change-log.yaml`)
      .catch(e => e)
      .then(resp => resp);
    console.log(response);
    if (!response.ok) {
      // TODO: Return error
    }
    const changes = await response.text();


    let config_map;
    try {
      config_map = parse(changes);
    } catch {
      // TODO: Return error
    }
    console.log(config_map);

    let change_data;
    try {
      change_data = JSON.parse(config_map.data["change-log.json"]);
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
