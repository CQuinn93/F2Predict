import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TextInput,
} from 'react-native';
import { DesignColors } from '@/constants/design-colors';

const SCORE_OPTIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;

interface ScorePickerProps {
  visible: boolean;
  currentValue: number | null;
  onSelect: (value: number | null) => void;
  onClose: () => void;
  label: string;
}

export function ScorePicker({ visible, currentValue, onSelect, onClose, label }: ScorePickerProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [selectedValue, setSelectedValue] = useState<number | null>(currentValue);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState<string>('');

  useEffect(() => {
    setSelectedValue(currentValue);
    if (visible && scrollViewRef.current && currentValue !== null) {
      // Scroll to current value
      const index = SCORE_OPTIONS.indexOf(currentValue);
      if (index !== -1) {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: index * ITEM_HEIGHT,
            animated: false,
          });
        }, 100);
      }
    }
  }, [visible, currentValue]);

  const handleScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(SCORE_OPTIONS.length - 1, index));
    setSelectedValue(SCORE_OPTIONS[clampedIndex]);
  };

  const handleScrollEnd = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(SCORE_OPTIONS.length - 1, index));
    
    // Snap to position
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
    
    setSelectedValue(SCORE_OPTIONS[clampedIndex]);
  };

  const handleConfirm = () => {
    if (showCustomInput && customValue.trim() !== '') {
      const customScore = parseInt(customValue, 10);
      if (!isNaN(customScore) && customScore >= 0 && customScore <= 99) {
        onSelect(customScore);
      } else {
        onSelect(selectedValue);
      }
    } else {
      onSelect(selectedValue);
    }
    setShowCustomInput(false);
    setCustomValue('');
    onClose();
  };

  const handleCustomInput = () => {
    setShowCustomInput(true);
    if (currentValue !== null && currentValue > 10) {
      setCustomValue(currentValue.toString());
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={onClose} />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{label}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {!showCustomInput ? (
            <>
              <View style={styles.pickerContainer}>
                {/* Selected value indicator */}
                <View style={styles.selectedIndicator} />
                
                <ScrollView
                  ref={scrollViewRef}
                  style={styles.pickerScrollView}
                  contentContainerStyle={styles.pickerContent}
                  showsVerticalScrollIndicator={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onScroll={handleScroll}
                  onScrollEndDrag={handleScrollEnd}
                  onMomentumScrollEnd={handleScrollEnd}
                  scrollEventThrottle={16}
                >
                  {/* Top padding */}
                  <View style={{ height: ITEM_HEIGHT * 2 }} />
                  
                  {SCORE_OPTIONS.map((score, index) => (
                    <View
                      key={score}
                      style={[
                        styles.pickerItem,
                        selectedValue === score && styles.pickerItemSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedValue === score && styles.pickerItemTextSelected,
                        ]}
                      >
                        {score}
                      </Text>
                    </View>
                  ))}
                  
                  {/* Bottom padding */}
                  <View style={{ height: ITEM_HEIGHT * 2 }} />
                </ScrollView>
              </View>

              <TouchableOpacity
                style={styles.customButton}
                onPress={handleCustomInput}
              >
                <Text style={styles.customButtonText}>Custom (0-99)</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.customInputContainer}>
              <Text style={styles.customInputLabel}>Enter custom score (0-99):</Text>
              <TextInput
                style={styles.customInput}
                value={customValue}
                onChangeText={setCustomValue}
                placeholder="0"
                placeholderTextColor="rgba(71, 74, 74, 0.5)"
                keyboardType="numeric"
                maxLength={2}
                textAlign="center"
                autoFocus
              />
              <TouchableOpacity
                style={styles.backToPickerButton}
                onPress={() => {
                  setShowCustomInput(false);
                  setCustomValue('');
                }}
              >
                <Text style={styles.backToPickerButtonText}>← Back to Picker</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.modalActions}>
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
              <Text style={styles.confirmButtonText}>
                {showCustomInput 
                  ? `Select ${customValue.trim() || selectedValue || '0'}` 
                  : `Select ${selectedValue !== null ? selectedValue : '0'}`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
    maxHeight: Dimensions.get('window').height * 0.5,
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
  pickerContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    position: 'relative',
    marginVertical: 20,
  },
  selectedIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    backgroundColor: DesignColors.primary + '20',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: DesignColors.primary,
    zIndex: 1,
  },
  pickerScrollView: {
    flex: 1,
  },
  pickerContent: {
    paddingHorizontal: 20,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemSelected: {
    // Selected styling handled by indicator
  },
  pickerItemText: {
    fontSize: 24,
    fontWeight: '400',
    color: DesignColors.text,
    opacity: 0.4,
  },
  pickerItemTextSelected: {
    fontWeight: '700',
    fontSize: 28,
    color: DesignColors.primary,
    opacity: 1,
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
  cancelButton: {
    backgroundColor: DesignColors.surface,
  },
  confirmButton: {
    backgroundColor: DesignColors.primary,
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
  customButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    marginTop: 8,
    borderRadius: 12,
    backgroundColor: DesignColors.surface,
    alignItems: 'center',
  },
  customButtonText: {
    color: DesignColors.text,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  customInputContainer: {
    padding: 20,
    alignItems: 'center',
    gap: 16,
  },
  customInputLabel: {
    color: DesignColors.text,
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.7,
  },
  customInput: {
    width: 120,
    height: 60,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: DesignColors.primary,
    backgroundColor: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
    color: DesignColors.text,
  },
  backToPickerButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  backToPickerButtonText: {
    color: DesignColors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
});
