import { useState, useEffect } from 'react';
import { AppShell, Group, ThemeIcon, ActionIcon, Modal, Table, ScrollArea, Text, Badge, Tabs, Grid, Card } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconCpu, IconSettings, IconInfoCircle, IconDatabase, IconServer, IconMap, IconBrandPython, IconBrandReact, IconContainer } from '@tabler/icons-react';

import { fetchLocations, fetchIncidents, analyzeLog } from './services/api';
import LogisticsMap from './components/Map/LogisticsMap';
import ControlPanel from './components/Dashboard/ControlPanel';
import './index.css';

const PUNJAB_CENTER = [30.9010, 75.8573];

export default function App() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeCoords, setActiveCoords] = useState(PUNJAB_CENTER);
  
  const [scanHistory, setScanHistory] = useState([]);
  const [searchResult, setSearchResult] = useState(null);
  const [dbLocations, setDbLocations] = useState([]);
  
  const [opened, { open, close }] = useDisclosure(false);

  useEffect(() => {
    fetchLocations().then(data => setDbLocations(Array.isArray(data) ? data : []));
    fetchIncidents().then(data => setScanHistory(Array.isArray(data) ? data : []));
  }, []);

  const handleAnalyze = async (textOverride = null) => {
    const textToAnalyze = textOverride || inputText;
    if (!textToAnalyze) return null;
    
    setLoading(true);
    try {
        const response = await analyzeLog(textToAnalyze);
        
        if (response && response.incident) {
            const data = response.incident;
            const geo = response.geo_target || PUNJAB_CENTER;
            
            setSearchResult({ coords: geo, label: data.location });
            setActiveCoords(geo);
            
            const newEntry = {
                id: Date.now(),
                position: geo,
                locationName: data.location || "Unknown Area",
                category: data.category || "General",
                priority: data.priority || "Low",
                text: textToAnalyze,
                time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
            };
            setScanHistory(prev => [newEntry, ...prev]);

            setLoading(false);
            if(!textOverride) setInputText("");
            
            return response; 
        }
    } catch (error) { 
        console.error("Analysis Failed:", error); 
    }
    setLoading(false);
    return null;
  };

  const handleSearchSelect = (val) => {
    if (!val) return;
    const loc = dbLocations.find(l => l.name === val);
    if(loc) { 
        setActiveCoords([loc.lat, loc.lng]); 
        setSearchResult({ coords: [loc.lat, loc.lng], label: loc.name }); 
    }
  };

  return (
    <AppShell padding="0" navbar={{ width: 360, breakpoint: 'sm' }} header={{ height: 60 }}>
      {/* HEADER */}
      <AppShell.Header p="xs" style={{ backgroundColor: '#141517', borderBottom: '1px solid #2C2E33', zIndex: 2001 }}>
        <Group justify="space-between" align="center" h="100%">
          <Group gap="xs" ml="md">
            <ThemeIcon size="lg" color="dark" variant="transparent"><IconCpu size={28} color="#40c057" /></ThemeIcon>
            <div>
              <Text size="sm" fw={900} c="gray.3" style={{ letterSpacing: '1px', lineHeight: 1 }}>RLIS COMMAND</Text>
              <Text size="xs" c="dimmed" fw={600}>PUNJAB LOGISTICS NETWORK</Text>
            </div>
          </Group>
          <Group mr="md">
            <Badge size="lg" variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 90 }}>
                SYSTEM ONLINE: {dbLocations.length} NODES
            </Badge>
            <ActionIcon variant="subtle" color="gray" size="lg" onClick={open}><IconSettings size={22} /></ActionIcon>
          </Group>
        </Group>
      </AppShell.Header>

      {/* NAVBAR */}
      <AppShell.Navbar p="md" style={{ backgroundColor: '#fff', borderRight: '1px solid #e9ecef', zIndex: 2000 }}>
        <ControlPanel 
            locations={dbLocations} 
            onSearchSelect={handleSearchSelect}
            inputText={inputText}
            setInputText={setInputText}
            onAnalyze={handleAnalyze} 
            loading={loading}
            scanHistory={scanHistory} 
        />
      </AppShell.Navbar>

      {/* MAP */}
      <AppShell.Main style={{ position: 'relative', padding: 0, overflow: 'hidden', zIndex: 0 }}>
        <LogisticsMap 
            center={PUNJAB_CENTER} 
            activeCoords={activeCoords} 
            locations={dbLocations} 
            incidents={scanHistory} 
            searchResult={searchResult} 
        />
      </AppShell.Main>
      
      {/* SETTINGS / INFO MODAL */}
      <Modal opened={opened} onClose={close} title={<Text fw={700} tt="uppercase">System Architecture</Text>} centered size="xl">
         <Tabs defaultValue="stack">
            <Tabs.List>
                <Tabs.Tab value="stack" leftSection={<IconServer size={14} />}>Tech Stack</Tabs.Tab>
                <Tabs.Tab value="nodes" leftSection={<IconDatabase size={14} />}>Active Nodes ({dbLocations.length})</Tabs.Tab>
                <Tabs.Tab value="about" leftSection={<IconInfoCircle size={14} />}>Project Goal</Tabs.Tab>
            </Tabs.List>

            {/* TECH STACK PANEL - The "Masterpiece" Display */}
            <Tabs.Panel value="stack" pt="md">
                <Text size="sm" fw={700} c="dimmed" mb="md" tt="uppercase">Core Technologies</Text>
                <Grid>
                    <Grid.Col span={4}>
                        <Card shadow="sm" padding="sm" radius="md" withBorder>
                            <Group gap="xs" mb="xs"><IconBrandPython size={20} color="#306998"/><Text fw={700} size="sm">Backend AI</Text></Group>
                            <Group gap={6}>
                                <Badge color="blue" variant="light">FastAPI</Badge>
                                <Badge color="orange" variant="light">Scikit-Learn (NLP)</Badge>
                                <Badge color="gray" variant="light">Pandas</Badge>
                            </Group>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Card shadow="sm" padding="sm" radius="md" withBorder>
                            <Group gap="xs" mb="xs"><IconDatabase size={20} color="#336791"/><Text fw={700} size="sm">Data Layer</Text></Group>
                            <Group gap={6}>
                                <Badge color="cyan" variant="light">PostgreSQL</Badge>
                                <Badge color="teal" variant="light">PostGIS (Spatial)</Badge>
                                <Badge color="indigo" variant="light">SQLAlchemy</Badge>
                            </Group>
                        </Card>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <Card shadow="sm" padding="sm" radius="md" withBorder>
                            <Group gap="xs" mb="xs"><IconBrandReact size={20} color="#61DAFB"/><Text fw={700} size="sm">Frontend UI</Text></Group>
                            <Group gap={6}>
                                <Badge color="blue" variant="light">React.js</Badge>
                                <Badge color="pink" variant="light">Mantine UI</Badge>
                                <Badge color="green" variant="light">Leaflet Maps</Badge>
                            </Group>
                        </Card>
                    </Grid.Col>
                     <Grid.Col span={12}>
                        <Card shadow="sm" padding="sm" radius="md" bg="gray.0" withBorder>
                            <Group gap="xs">
                                <IconContainer size={20} color="#007bff"/>
                                <Text fw={700} size="sm">Infrastructure:</Text>
                                <Badge color="dark">Docker</Badge>
                                <Badge color="dark">Docker Compose</Badge>
                            </Group>
                        </Card>
                    </Grid.Col>
                </Grid>
            </Tabs.Panel>

            <Tabs.Panel value="nodes" pt="xs">
                <ScrollArea h={400}>
                    <Table striped highlightOnHover withTableBorder>
                        <Table.Thead bg="gray.1"><Table.Tr><Table.Th>Name</Table.Th><Table.Th>Type</Table.Th><Table.Th>Coords</Table.Th></Table.Tr></Table.Thead>
                        <Table.Tbody>
                            {dbLocations.map((place) => (
                                <Table.Tr key={place.id}>
                                    <Table.Td fw={500}>{place.name}</Table.Td>
                                    <Table.Td><Badge size="sm" variant="light" color="gray">{place.type}</Badge></Table.Td>
                                    <Table.Td style={{ fontFamily: 'monospace' }}>{place.lat.toFixed(4)}, {place.lng.toFixed(4)}</Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </ScrollArea>
            </Tabs.Panel>

            <Tabs.Panel value="about" pt="md">
                <Text size="sm" mb="xs" fw={700}>Rural Logistics Intelligence System (Punjab)</Text>
                <Text size="sm" mb="md" c="dimmed">
                    An AI-powered command center designed to optimize rural supply chains. 
                    It ingests unstructured driver logs (via NLP), maps them to a digital twin of the Punjab road network, 
                    and visualizes disruptions in real-time.
                </Text>
            </Tabs.Panel>
         </Tabs>
      </Modal>
    </AppShell>
  );
}