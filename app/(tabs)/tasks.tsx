import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

type Task = {
  id: string;
  title: string;
  description?: string;
  assignedBot?: string;
  eta?: string;
  completed: boolean;
};

const SAMPLE_TASKS: Task[] = [
  { id: '1', title: 'Search sector A3', description: 'High priority — possible survivors', assignedBot: 'RB-01', eta: '5m', completed: false },
  { id: '2', title: 'Clear access path', description: 'Remove small debris', assignedBot: 'RB-02', eta: '12m', completed: false },
  { id: '3', title: 'Thermal scan sector B1', description: 'Verify heat signatures', assignedBot: 'RB-03', eta: '2m', completed: true },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(SAMPLE_TASKS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showSuggest, setShowSuggest] = useState(false);

  const overlayColor = useThemeColor(
    { light: 'rgba(0,0,0,0.28)', dark: 'rgba(0,0,0,0.6)' },
    'background'
  );
  const modalBgLight = '#ffffff';
  const modalBgDark = '#1b1b1b';
  const modalBorder = useThemeColor(
    { light: 'rgba(10,126,164,0.14)', dark: 'rgba(255,255,255,0.06)' },
    'tint'
  );

  function generateSuggestions(): Task[] {
    // Simple heuristic suggestions based on existing tasks and missing actions
    const suggestions: Task[] = [];
    const pending = tasks.filter(t => !t.completed);
    if (pending.length === 0) {
      suggestions.push({ id: 's-1', title: 'Run full-area scan', description: 'Start an automated sweep of all sectors', completed: false });
    } else {
      // Suggest reinforcing active sectors, thermal scan, and clearing paths
      const seenTitles = new Set(tasks.map(t => t.title.toLowerCase()));
      if (!seenTitles.has('deploy additional bot')) {
        suggestions.push({ id: 's-2', title: 'Deploy additional bot', description: 'Assign a spare robot to high-priority sector', completed: false });
      }
      if (!seenTitles.has('perform thermal scan')) {
        suggestions.push({ id: 's-3', title: 'Perform thermal scan', description: 'Check for heat signatures in nearby sectors', completed: false });
      }
      if (!seenTitles.has('clear access path')) {
        suggestions.push({ id: 's-4', title: 'Clear access path', description: 'Remove debris to create a safe corridor', completed: false });
      }
    }

    return suggestions;
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return tasks;
    if (filter === 'pending') return tasks.filter(t => !t.completed);
    return tasks.filter(t => t.completed);
  }, [tasks, filter]);

  function toggleComplete(id: string) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  }

  function renderItem({ item }: { item: Task }) {
    return (
      <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.taskRow}>
        <View style={styles.taskLeft}>
          <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
          {item.description ? <ThemedText type="subtitle">{item.description}</ThemedText> : null}
          <View style={styles.metaRow}>
            {item.assignedBot ? <ThemedText style={styles.assignedBot}>{item.assignedBot}</ThemedText> : null}
            {item.eta ? <ThemedText style={styles.eta}>{item.eta}</ThemedText> : null}
          </View>
        </View>

        <View style={styles.statusPill}>
          <ThemedText type="defaultSemiBold">{item.completed ? 'Done' : 'Open'}</ThemedText>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Tasks</ThemedText>
        <View style={styles.filters}>
          <TouchableOpacity onPress={() => setFilter('all')} style={[styles.filterBtn, filter === 'all' && styles.filterActive]}>
            <ThemedText>All</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('pending')} style={[styles.filterBtn, filter === 'pending' && styles.filterActive]}>
            <ThemedText>Pending</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('completed')} style={[styles.filterBtn, filter === 'completed' && styles.filterActive]}>
            <ThemedText>Completed</ThemedText>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={i => i.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={<ThemedText style={styles.empty}>No tasks</ThemedText>}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => setShowSuggest(true)}>
        <ThemedText type="defaultSemiBold" lightColor="#fff" darkColor="#fff">+ Add Task</ThemedText>
      </TouchableOpacity>

      <Modal visible={showSuggest} animationType="fade" transparent>
        <View style={[styles.modalOverlay, { backgroundColor: overlayColor }]}>
          <ThemedView
            lightColor={modalBgLight}
            darkColor={modalBgDark}
            style={[styles.modalContainer, { borderColor: modalBorder, borderWidth: 1 }]}
          >
          <ThemedText type="title">Suggested Tasks</ThemedText>
          <ThemedText style={{ marginTop: 8 }}>Based on recent activity — tap to add</ThemedText>

          <FlatList
            data={generateSuggestions()}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.suggestRow}
                onPress={() => {
                  // add suggestion as a new task (generate unique id)
                  const nextId = String(Date.now());
                  setTasks(prev => [{ ...item, id: nextId }, ...prev]);
                  setShowSuggest(false);
                }}
              >
                <ThemedText type="defaultSemiBold">{item.title}</ThemedText>
                {item.description ? <ThemedText style={{ marginTop: 4 }}>{item.description}</ThemedText> : null}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
            contentContainerStyle={{ paddingVertical: 12 }}
          />

          <TouchableOpacity style={styles.closeBtn} onPress={() => setShowSuggest(false)}>
            <ThemedText>Close</ThemedText>
          </TouchableOpacity>
          </ThemedView>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  filters: { flexDirection: 'row', marginTop: 12 },
  filterBtn: { paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderRadius: 6 },
  filterActive: { backgroundColor: 'rgba(10,126,164,0.08)' },
  list: { padding: 12 },
  taskRow: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 8 },
  taskLeft: { flex: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  assignedBot: { marginRight: 12 },
  eta: { marginLeft: 0 },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: 'rgba(0,0,0,0.04)' },
  sep: { height: 8 },
  empty: { padding: 24, textAlign: 'center' },
  addButton: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
  },
  modalContainer: {
    width: '92%',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  suggestRow: { padding: 12, borderRadius: 8 },
  closeBtn: { marginTop: 12, alignSelf: 'flex-end', padding: 8 },
});
