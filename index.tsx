import React, { useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';

type Task = {
  id: string;
  text: string;
  description: string;
  completed: boolean;
};

export default function App() {
  const [taskText, setTaskText] = useState('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [descriptionInput, setDescriptionInput] = useState('');

  const addTask = () => {
    if (!taskText.trim()) return;
    const id = uuid.v4() as string;
    setTasks([...tasks, { id, text: taskText, description: '', completed: false }]);
    setTaskText('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = () => {
    if (!editingText.trim() || editingId === null) return;
    setTasks(tasks.map(task =>
      task.id === editingId ? { ...task, text: editingText } : task
    ));
    setEditingId(null);
    setEditingText('');
  };

  const toggleComplete = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const openDescriptionModal = (task: Task) => {
    setSelectedTask(task);
    setDescriptionInput(task.description);
    setModalVisible(true);
  };

  const saveDescription = () => {
    if (!selectedTask) return;
    setTasks(tasks.map(task =>
      task.id === selectedTask.id ? { ...task, description: descriptionInput } : task
    ));
    setModalVisible(false);
    setSelectedTask(null);
    setDescriptionInput('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
        <Text style={styles.title}>📝 Gamze's ToDo</Text>

        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Yeni görev gir..."
            placeholderTextColor="#999"
            value={taskText}
            onChangeText={setTaskText}
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.fullWidthAddButton} onPress={addTask}>
          <Text style={styles.fullWidthAddButtonText}>Ekle</Text>
        </TouchableOpacity>

        <FlatList
          data={tasks}
          ListEmptyComponent={<Text style={styles.empty}>Henüz görev yok.</Text>}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              {editingId === item.id ? (
                <>
                  <TextInput
                    value={editingText}
                    onChangeText={setEditingText}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={saveEdit} style={styles.saveButton}>
                    <Text style={styles.save}>💾 Kaydet</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity onPress={() => toggleComplete(item.id)}>
                    <Text style={[styles.taskText, item.completed && styles.completed]}>
                      {item.completed ? '✅ ' : ''}{item.text}
                    </Text>
                  </TouchableOpacity>
                  {item.description !== '' && (
                    <Text style={styles.descriptionText}>📄 {item.description}</Text>
                  )}
                  <View style={styles.buttons}>
                    <TouchableOpacity onPress={() => startEdit(item)}>
                      <Text style={styles.edit}>Görevi Düzenle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openDescriptionModal(item)}>
                      <Text style={styles.descBtn}>Açıklama Ekle / Düzenle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteTask(item.id)}>
                      <Text style={styles.delete}>Sil</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          )}
        />

        <Modal visible={modalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Açıklama Ekle / Düzenle</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Görev açıklaması..."
                value={descriptionInput}
                onChangeText={setDescriptionInput}
                multiline
              />
              <TouchableOpacity style={styles.modalSaveBtn} onPress={saveDescription}>
                <Text style={styles.modalSaveText}>Kaydet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#eaf4f8' },
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1d3557',
  },
  inputWrapper: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    fontSize: 16,
    color: '#000',
  },
  fullWidthAddButton: {
    backgroundColor: '#2a9d8f',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  fullWidthAddButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  taskText: {
    fontSize: 16,
    color: '#333',
  },
  completed: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  edit: { color: '#007bff', fontWeight: '600', fontSize: 14 },
  delete: { color: '#e63946', fontWeight: '600', fontSize: 14 },
  descBtn: { color: '#6c757d', fontWeight: '600', fontSize: 14 },
  save: {
    color: '#28a745',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  empty: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: 40,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#1d3557',
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    height: 100,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 15,
    color: '#000',
  },
  modalSaveBtn: {
    backgroundColor: '#457b9d',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalSaveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
