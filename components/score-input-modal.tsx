import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  TextInput,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { DesignColors } from '@/constants/design-colors';

// Common score combinations in football
const QUICK_SCORES = [
  { home: 0, away: 0, label: '0-0' },
  { home: 1, away: 0, label: '1-0' },
  { home: 0, away: 1, label: '0-1' },
  { home: 1, away: 1, label: '1-1' },
  { home: 2, away: 0, label: '2-0' },
  { home: 0, away: 2, label: '0-2' },
  { home: 2, away: 1, label: '2-1' },
  { home: 1, away: 2, label: '1-2' },
  { home: 2, away: 2, label: '2-2' },
  { home: 3, away: 0, label: '3-0' },
  { home: 0, away: 3, label: '0-3' },
  { home: 3, away: 1, label: '3-1' },
  { home: 1, away: 3, label: '1-3' },
  { home: 3, away: 2, label: '3-2' },
  { home: 2, away: 3, label: '2-3' },
  { home: 4, away: 0, label: '4-0' },
  { home: 0, away: 4, label: '0-4' },
];

interface ScoreInputModalProps {
  visible: boolean;
  homeScore: number | null;
  awayScore: number | null;
  homeTeamName: string;
  awayTeamName: string;
  onConfirm: (homeScore: number | null, awayScore: number | null) => void;
  onClose: () => void;
}

export function ScoreInputModal({
  visible,
  homeScore,
  awayScore,
  homeTeamName,
  awayTeamName,
  onConfirm,
  onClose,
}: ScoreInputModalProps) {
  const [localHomeScore, setLocalHomeScore] = useState<string>(
    homeScore !== null ? homeScore.toString() : ''
  );
  const [localAwayScore, setLocalAwayScore] = useState<string>(
    awayScore !== null ? awayScore.toString() : ''
  );
  const homeInputRef = useState<any>(null)[0];
  const awayInputRef = useState<any>(null)[0];

  useEffect(() => {
    if (visible) {
      setLocalHomeScore(homeScore !== null ? homeScore.toString() : '');
      setLocalAwayScore(awayScore !== null ? awayScore.toString() : '');
      // Auto-focus home input when modal opens
      setTimeout(() => {
        homeInputRef?.current?.focus();
      }, 300);
    }
  }, [visible, homeScore, awayScore]);

  const handleQuickScore = (home: number, away: number) => {
    setLocalHomeScore(home.toString());
    setLocalAwayScore(away.toString());
  };

  const handleConfirm = () => {
    const home = localHomeScore.trim() === '' ? null : parseInt(localHomeScore, 10);
    const away = localAwayScore.trim() === '' ? null : parseInt(localAwayScore, 10);
    
    if (home !== null && (isNaN(home) || home < 0 || home > 99)) {
      return;
    }
    if (away !== null && (isNaN(away) || away < 0 || away > 99)) {
      return;
    }
    
    onConfirm(home, away);
    onClose();
  };

  const handleClear = () => {
    setLocalHomeScore('');
    setLocalAwayScore('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Enter Score</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Match Info */}
          <View style={styles.matchInfo}>
            <Text style={styles.teamName} numberOfLines={1}>
              {homeTeamName}
            </Text>
            <Text style={styles.vsText}>vs</Text>
            <Text style={styles.teamName} numberOfLines={1}>
              {awayTeamName}
            </Text>
          </View>

          {/* Quick Score Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.quickActionsLabel}>Quick Select:</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.quickActionsScroll}
            >
              {QUICK_SCORES.map((score, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.quickActionButton,
                    localHomeScore === score.home.toString() &&
                    localAwayScore === score.away.toString() &&
                    styles.quickActionButtonSelected,
                  ]}
                  onPress={() => handleQuickScore(score.home, score.away)}
                >
                  <Text
                    style={[
                      styles.quickActionText,
                      localHomeScore === score.home.toString() &&
                      localAwayScore === score.away.toString() &&
                      styles.quickActionTextSelected,
                    ]}
                  >
                    {score.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Score Inputs */}
          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{homeTeamName}</Text>
              <TextInput
                ref={homeInputRef}
                style={styles.scoreInput}
                value={localHomeScore}
                onChangeText={(text) => {
                  const num = parseInt(text, 10);
                  if (text === '' || (!isNaN(num) && num >= 0 && num <= 99)) {
                    setLocalHomeScore(text);
                  }
                }}
                placeholder="0"
                placeholderTextColor="rgba(71, 74, 74, 0.5)"
                keyboardType="numeric"
                maxLength={2}
                textAlign="center"
                selectTextOnFocus
              />
            </View>

            <Text style={styles.dashText}>-</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>{awayTeamName}</Text>
              <TextInput
                ref={awayInputRef}
                style={styles.scoreInput}
                value={localAwayScore}
                onChangeText={(text) => {
                  const num = parseInt(text, 10);
                  if (text === '' || (!isNaN(num) && num >= 0 && num <= 99)) {
                    setLocalAwayScore(text);
                  }
                }}
                placeholder="0"
                placeholderTextColor="rgba(71, 74, 74, 0.5)"
                keyboardType="numeric"
                maxLength={2}
                textAlign="center"
                selectTextOnFocus
              />
            </View>
          </View>

          {/* Actions */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, styles.clearButton]}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: DesignColors.surface,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DesignColors.text,
    fontFamily: 'Ethnocentric',
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 24,
    color: DesignColors.text,
    opacity: 0.5,
  },
  matchInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  teamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: DesignColors.text,
    textAlign: 'center',
  },
  vsText: {
    fontSize: 16,
    fontWeight: '700',
    color: DesignColors.text,
    opacity: 0.5,
  },
  quickActionsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: DesignColors.surface,
  },
  quickActionsLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignColors.text,
    opacity: 0.7,
    marginBottom: 12,
  },
  quickActionsScroll: {
    gap: 8,
  },
  quickActionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: DesignColors.surface,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: 8,
  },
  quickActionButtonSelected: {
    borderColor: DesignColors.primary,
    backgroundColor: DesignColors.primary + '20',
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: DesignColors.text,
  },
  quickActionTextSelected: {
    color: DesignColors.primary,
    fontWeight: '700',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 16,
  },
  inputGroup: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: DesignColors.text,
    opacity: 0.7,
  },
  scoreInput: {
    width: 80,
    height: 70,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: DesignColors.primary,
    backgroundColor: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    color: DesignColors.text,
  },
  dashText: {
    fontSize: 28,
    fontWeight: '700',
    color: DesignColors.text,
    opacity: 0.5,
    marginTop: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clearButton: {
    backgroundColor: DesignColors.surface,
  },
  cancelButton: {
    backgroundColor: DesignColors.surface,
  },
  confirmButton: {
    backgroundColor: DesignColors.primary,
  },
  clearButtonText: {
    color: DesignColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: DesignColors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonText: {
    color: DesignColors.textOnDark,
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Ethnocentric',
  },
});
