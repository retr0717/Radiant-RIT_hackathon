import { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Cloud, Download, FileText, Trash2, CircleHelp as HelpCircle, Info } from 'lucide-react-native';
import { useNotes } from '@/context/NoteContext';
import { exportToPDF } from '@/utils/pdfUtils';
import { connectToGoogleDrive, backupToGoogleDrive } from '@/utils/driveUtils';

export default function SettingsScreen() {
  const { notes, clearAllNotes, exportData, importData } = useNotes();
  const [autoBackup, setAutoBackup] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoOCR, setAutoOCR] = useState(false);
  const [isConnectedToDrive, setIsConnectedToDrive] = useState(false);

  const handleConnectToDrive = async () => {
    try {
      const connected = await connectToGoogleDrive();
      setIsConnectedToDrive(connected);
      if (connected) {
        Alert.alert('Success', 'Connected to Google Drive successfully');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Google Drive');
    }
  };

  const handleBackupNow = async () => {
    if (!isConnectedToDrive) {
      Alert.alert('Not Connected', 'Please connect to Google Drive first');
      return;
    }
    
    try {
      await backupToGoogleDrive(notes);
      Alert.alert('Success', 'Backup completed successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to backup notes');
    }
  };

  const handleExportPDF = async () => {
    if (notes.length === 0) {
      Alert.alert('No Notes', 'You have no notes to export');
      return;
    }
    
    try {
      const url = await exportToPDF(notes);
      Alert.alert('Success', `PDF exported successfully. ${url}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export PDF');
    }
  };

  const handleClearAllNotes = () => {
    Alert.alert(
      'Delete All Notes',
      'Are you sure you want to delete all notes? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            clearAllNotes();
            Alert.alert('Success', 'All notes have been deleted');
          }
        }
      ]
    );
  };

  const handleExportData = async () => {
    try {
      const result = await exportData();
      Alert.alert('Success', `Data exported successfully. ${result}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export data');
    }
  };

  const handleImportData = async () => {
    Alert.alert(
      'Import Data',
      'This will replace all your current notes. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Import', 
          onPress: async () => {
            try {
              await importData();
              Alert.alert('Success', 'Data imported successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to import data');
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left']}>
      <Text style={styles.title}>Settings</Text>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: '#cbd5e1', true: '#818cf8' }}
              thumbColor={darkMode ? '#6366f1' : '#f8fafc'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Backup & Sync</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Auto Backup to Google Drive</Text>
            <Switch
              value={autoBackup}
              onValueChange={setAutoBackup}
              trackColor={{ false: '#cbd5e1', true: '#818cf8' }}
              thumbColor={autoBackup ? '#6366f1' : '#f8fafc'}
              disabled={!isConnectedToDrive}
            />
          </View>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleConnectToDrive}
          >
            <Cloud size={20} color="#ffffff" />
            <Text style={styles.buttonText}>
              {isConnectedToDrive ? 'Reconnect to Google Drive' : 'Connect to Google Drive'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.button, !isConnectedToDrive && styles.disabledButton]}
            onPress={handleBackupNow}
            disabled={!isConnectedToDrive}
          >
            <Cloud size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Backup Now</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Auto OCR for Handwriting</Text>
            <Switch
              value={autoOCR}
              onValueChange={setAutoOCR}
              trackColor={{ false: '#cbd5e1', true: '#818cf8' }}
              thumbColor={autoOCR ? '#6366f1' : '#f8fafc'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Export & Import</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={handleExportPDF}
          >
            <FileText size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Export as PDF</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleExportData}
          >
            <Download size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Export Data</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.button}
            onPress={handleImportData}
          >
            <Download size={20} color="#ffffff" style={{ transform: [{ rotate: '180deg' }] }} />
            <Text style={styles.buttonText}>Import Data</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity 
            style={[styles.button, styles.dangerButton]}
            onPress={handleClearAllNotes}
          >
            <Trash2 size={20} color="#ffffff" />
            <Text style={styles.buttonText}>Clear All Notes</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.aboutItem}>
            <Info size={20} color="#6366f1" />
            <Text style={styles.aboutText}>Version 1.0.0</Text>
          </View>
          <View style={styles.aboutItem}>
            <HelpCircle size={20} color="#6366f1" />
            <Text style={styles.aboutText}>Help & Support</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingLabel: {
    fontSize: 16,
    color: '#475569',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6366f1',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  dangerButton: {
    backgroundColor: '#ef4444',
  },
  aboutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  aboutText: {
    fontSize: 16,
    color: '#475569',
    marginLeft: 12,
  },
});