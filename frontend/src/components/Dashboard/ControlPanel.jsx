import { useState } from 'react';
import { Stack, Select, Textarea, Button, Text, Group, Badge, Divider, ScrollArea, Timeline, Card, Code, Loader, Grid, Box } from '@mantine/core';
import { IconSearch, IconSend, IconBolt, IconAlertTriangle, IconTerminal2, IconDatabase, IconMapPin, IconActivity } from '@tabler/icons-react';

export default function ControlPanel({ 
    locations, onSearchSelect, inputText, setInputText, onAnalyze, loading, scanHistory
}) {
  
  const [decoderStats, setDecoderStats] = useState(null);
  const [lastIncident, setLastIncident] = useState(null);

  // Prepare Autocomplete Data
  const selectData = locations.map(l => l.name).sort();

  const runScenario = (text) => {
      setInputText(text); 
      handleProcess(text); 
  };

  const handleProcess = async (textOverride = null) => {
      const textToProcess = String(textOverride || inputText || "");
      if (!textToProcess.trim()) return;
      
      setDecoderStats(null); 
      setLastIncident(null);

      const result = await onAnalyze(textToProcess);
      
      if (result) {
          if (result.nlp_debug) setDecoderStats(result.nlp_debug);
          if (result.incident) setLastIncident(result.incident);
      }
  };

  return (
    // FIX: Wrap entire panel in ScrollArea so nothing gets cut off
    <ScrollArea h="100%" offsetScrollbars type="scroll">
      <Stack gap="md" pb="xl" pr="xs"> {/* Added Padding Bottom & Right */}
          
          {/* 1. NODE NAVIGATION */}
          <div>
              <Text size="xs" fw={700} c="dimmed" mb={4} tt="uppercase">Locate Network Node</Text>
              <Select 
                  placeholder="Search Hub, Mandi..."
                  data={selectData}
                  searchable
                  nothingFoundMessage="Node not found"
                  leftSection={<IconSearch size={16} />}
                  onChange={onSearchSelect}
                  maxDropdownHeight={200}
                  styles={{ 
                      input: { backgroundColor: '#f1f3f5', borderColor: '#dee2e6' },
                      dropdown: { zIndex: 3000 }
                  }}
              />
              <Group gap={6} mt={8}>
                  <Badge size="sm" variant="dot" color="red" style={{cursor: 'pointer'}} onClick={() => onSearchSelect("Ludhiana Transport Nagar")}>HUB: Ludhiana</Badge>
                  <Badge size="sm" variant="dot" color="yellow" style={{cursor: 'pointer'}} onClick={() => onSearchSelect("Khanna Mandi")}>MANDI: Khanna</Badge>
              </Group>
          </div>

          <Divider color="gray.2" />

          {/* 2. LOG INPUT */}
          <div>
              <Group justify="space-between" mb="xs">
                  <Text size="xs" fw={700} c="dimmed" tt="uppercase">Log Entry (Text Input)</Text>
                  <Badge size="xs" variant="light" color="blue" leftSection={<IconDatabase size={10}/>}>NLP ENGINE READY</Badge>
              </Group>
              
              <Textarea 
                  placeholder="Type incident log here..."
                  minRows={3}
                  radius="md"
                  value={inputText}
                  onChange={(e) => setInputText(e.currentTarget.value)}
                  styles={{ input: { fontFamily: 'monospace', fontSize: '13px', backgroundColor: '#f8f9fa' } }}
              />
              
              <Button 
                  fullWidth mt="sm" 
                  color="dark" 
                  radius="md"
                  rightSection={loading ? <Loader size={16} color="white"/> : <IconSend size={16}/>}
                  disabled={(!inputText || !inputText.trim()) && !loading}
                  onClick={() => handleProcess()} 
              >
                  {loading ? "ANALYZING..." : "PROCESS INTELLIGENCE"}
              </Button>
          </div>

          {/* --- LIVE NLP EXTRACTION TERMINAL --- */}
          {decoderStats && lastIncident && (
              <Card bg="#1A1B1E" radius="md" p="md" style={{ border: '1px solid #2C2E33', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
                  <Group mb={12} justify="space-between">
                      <Group gap={8}>
                          <IconTerminal2 size={18} color="#40c057"/>
                          <Text c="gray.3" size="xs" fw={800} tt="uppercase" style={{letterSpacing: '0.5px'}}>Live Backend Extraction</Text>
                      </Group>
                      <Badge variant="filled" color="dark" size="xs">{decoderStats.processing_time}</Badge>
                  </Group>
                  
                  <Grid gutter={10}>
                      {/* 1. Location */}
                      <Grid.Col span={12}>
                          <Group gap={10} align="center">
                              <IconMapPin size={16} color="#20c997" />
                              <Text c="dimmed" size="xs" ff="monospace" tt="uppercase">Target:</Text>
                              <Code color="teal" c="white" fw={700} style={{fontSize: '11px'}}>{lastIncident.location}</Code>
                          </Group>
                      </Grid.Col>

                      {/* 2. Problem */}
                      <Grid.Col span={12}>
                          <Group gap={10} align="center">
                              <IconActivity size={16} color="#fcc419" />
                              <Text c="dimmed" size="xs" ff="monospace" tt="uppercase">Event:</Text>
                              <Text c="yellow" size="xs" fw={700} ff="monospace">{lastIncident.category}</Text>
                          </Group>
                      </Grid.Col>

                      {/* 3. Severity */}
                      <Grid.Col span={12}>
                          <Group gap={10} align="center">
                              <IconAlertTriangle size={16} color={lastIncident.priority === "Critical" ? "#ff6b6b" : "#4dabf7"} />
                              <Text c="dimmed" size="xs" ff="monospace" tt="uppercase">Alert:</Text>
                              <Badge 
                                  size="sm" variant="filled"
                                  color={lastIncident.priority === "Critical" ? "red" : lastIncident.priority === "High" ? "orange" : lastIncident.priority === "Medium" ? "yellow" : "green"}
                              >
                                  {lastIncident.priority}
                              </Badge>
                          </Group>
                      </Grid.Col>

                      {/* 4. Tokens */}
                      <Grid.Col span={12}>
                           <Box mt={4} pt={4} style={{ borderTop: '1px solid #333' }}>
                              <Group gap={6}>
                                  <Text c="dimmed" size="xs" ff="monospace">TOKENS:</Text>
                                  <Text c="gray.5" size="xs" ff="monospace" style={{wordBreak: 'break-all', fontSize:'11px'}}>
                                      [{decoderStats.entities?.join(", ") || "None"}]
                                  </Text>
                              </Group>
                           </Box>
                      </Grid.Col>
                  </Grid>
              </Card>
          )}

          <Divider color="gray.2" />

          {/* 3. SCENARIOS */}
          <div>
              <Text size="xs" fw={700} c="dimmed" mb="xs" tt="uppercase">Inject Test Scenarios</Text>
              <Stack gap={8}>
                  <Button 
                      variant="default" fullWidth justify="space-between"
                      styles={{ root: { borderColor: '#ff3b3b', color: '#e03131', backgroundColor: '#fff5f5', height: 'auto', padding: '8px' } }}
                      onClick={() => runScenario("Gas tanker leak ho gya GT Road pe near Ludhiana, massive fire risk!")}
                  >
                      <Stack gap={0} align="flex-start">
                          <Group gap={6}><IconAlertTriangle size={14}/> <Text size="xs" fw={700}>Tanker Leak</Text></Group>
                          <Text size="10px" c="dimmed" truncate>"Gas tanker leak ho gya GT Road..."</Text>
                      </Stack>
                      <Badge color="red" size="xs">CRITICAL</Badge>
                  </Button>

                  <Button 
                      variant="default" fullWidth justify="space-between"
                      styles={{ root: { borderColor: '#fd7e14', color: '#e8590c', backgroundColor: '#fff9db', height: 'auto', padding: '8px' } }}
                      onClick={() => runScenario("Khanna Mandi bahar 4 km lambi line hai, fas gaye. Total chakka jam.")}
                  >
                      <Stack gap={0} align="flex-start">
                          <Group gap={6}><IconBolt size={14}/> <Text size="xs" fw={700}>Mandi Chakka Jam</Text></Group>
                          <Text size="10px" c="dimmed" truncate>"4 km lambi line hai..."</Text>
                      </Stack>
                      <Badge color="orange" size="xs">HIGH</Badge>
                  </Button>

                  <Button 
                      variant="default" fullWidth justify="space-between"
                      styles={{ root: { borderColor: '#fcc419', color: '#f08c00', backgroundColor: '#fff9db', height: 'auto', padding: '8px' } }}
                      onClick={() => runScenario("Boht dhund hai near Phagwara, driving at 10kmph, visibility zero.")}
                  >
                      <Stack gap={0} align="flex-start">
                          <Group gap={6}><IconBolt size={14}/> <Text size="xs" fw={700}>Heavy Fog/Smog</Text></Group>
                          <Text size="10px" c="dimmed" truncate>"Boht dhund hai near Phagwara..."</Text>
                      </Stack>
                      <Badge color="yellow" size="xs">MED</Badge>
                  </Button>

                  <Button 
                      variant="default" fullWidth justify="space-between"
                      styles={{ root: { borderColor: '#20c997', color: '#0ca678', backgroundColor: '#e6fcf5', height: 'auto', padding: '8px' } }}
                      onClick={() => runScenario("Maal unload ho gya at Ludhiana Transport Nagar, rasta clear hai.")}
                  >
                      <Stack gap={0} align="flex-start">
                          <Group gap={6}><IconBolt size={14}/> <Text size="xs" fw={700}>Logistics Update</Text></Group>
                          <Text size="10px" c="dimmed" truncate>"Maal unload ho gya..."</Text>
                      </Stack>
                      <Badge color="teal" size="xs">LOW</Badge>
                  </Button>
              </Stack>
          </div>
          
          <Divider color="gray.2" />

          {/* 4. FEED (Updated: Removed nested scroll, now flows naturally) */}
          <div>
              <Text size="xs" fw={700} c="dimmed" tt="uppercase" mb="sm">Decoded Incident Feed</Text>
              {scanHistory.length === 0 ? (
                  <Text c="dimmed" size="xs" ta="center" mt="xl" fs="italic">System ready. Waiting for logs...</Text>
              ) : (
                  <Timeline active={0} bulletSize={14} lineWidth={2}>
                      {scanHistory.map((item) => (
                          <Timeline.Item 
                              key={item.id} 
                              bullet={<div style={{width: 8, height: 8, background: 'currentColor', borderRadius: '50%'}}></div>}
                              color={item.priority.includes("Critical") ? "red" : item.priority.includes("High") ? "orange" : item.priority.includes("Medium") ? "yellow" : "green"}
                          >
                              <Text c="dark" size="xs" fw={700} tt="uppercase">{item.locationName}</Text>
                              <Text c="dimmed" size="xs" lh={1.3}>{item.text}</Text>
                          </Timeline.Item>
                      ))}
                  </Timeline>
              )}
          </div>

      </Stack>
    </ScrollArea>
  );
}