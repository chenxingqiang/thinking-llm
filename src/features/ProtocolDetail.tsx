import React from 'react';
import { Container, Grid, Paper, Tabs, Tab } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ProtocolHeader } from '../components/protocol/ProtocolHeader';
import { ProtocolContent } from '../components/protocol/ProtocolContent';
import { ProtocolVersions } from '../components/protocol/ProtocolVersions';
import { ProtocolComments } from '../components/protocol/ProtocolComments';
import { ProtocolUsage } from '../components/protocol/ProtocolUsage';
import { useProtocol } from '../hooks/useProtocol';
import { Loading } from '../components/common/Loading';

export const ProtocolDetail: React.FC = () => {
  const { id = '' } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = React.useState(0);
  const { protocol, loading, error } = useProtocol(id);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (loading) return <Loading />;
  if (error || !protocol) return <div>Error loading protocol</div>;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ProtocolHeader protocol={protocol} />
        </Grid>
        <Grid item xs={12}>
          <Paper>
            <Tabs value={activeTab} onChange={handleTabChange}>
              <Tab label="Overview" />
              <Tab label="Versions" />
              <Tab label="Usage" />
              <Tab label="Comments" />
            </Tabs>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          {activeTab === 0 && <ProtocolContent protocol={protocol} />}
          {activeTab === 1 && <ProtocolVersions />}
          {activeTab === 2 && <ProtocolUsage />}
          {activeTab === 3 && <ProtocolComments />}
        </Grid>
      </Grid>
    </Container>
  );
}; 