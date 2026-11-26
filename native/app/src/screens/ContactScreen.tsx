import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { api, ApiError, ContactResponse } from '../api';
import { Button, Header, LinkButton, colors, shared } from '../ui';

const TOPICS = [
  { value: 'order', label: 'Order' },
  { value: 'payment', label: 'Payment' },
  { value: 'other', label: 'Other' },
];

export function ContactScreen({ onBack, backLabel }: { onBack: () => void; backLabel: string }) {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [via, setVia] = useState('');
  const [message, setMessage] = useState('');
  const [terms, setTerms] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sent, setSent] = useState<ContactResponse | null>(null);
  const [sending, setSending] = useState(false);

  // Validation happens on the backend (POST /api/contact); we only show its field errors.
  async function send() {
    setErrors({});
    setSending(true);
    try {
      setSent(await api.contact({ name, topic, via, message, terms }));
    } catch (e) {
      setErrors(e instanceof ApiError ? { ...e.errors, form: Object.keys(e.errors).length ? '' : e.message } : { form: 'Something went wrong' });
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView style={shared.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Header testID="contact-screen" title="Contact us" left={<LinkButton testID="back-button" title={`‹ ${backLabel}`} onPress={onBack} />} />

      {sent ? (
        <View style={shared.content}>
          <Text testID="contact-success" style={styles.success}>
            Thanks {sent.name}! Ticket #{sent.ticketId} was created. We will reply by {sent.via}.
          </Text>
        </View>
      ) : (
        <ScrollView testID="contact-form" contentContainerStyle={shared.content} keyboardShouldPersistTaps="handled">
          <Text style={shared.label}>Your name</Text>
          <TextInput testID="contact-name" accessibilityLabel="Your name" style={shared.input} value={name} onChangeText={setName} placeholder="Ana Tester" />
          <FieldError field="name" errors={errors} />

          <Text style={shared.label}>Topic</Text>
          <View style={styles.segments}>
            {TOPICS.map((t) => (
              <Pressable
                key={t.value}
                testID={`topic-${t.value}`}
                accessibilityRole="button"
                accessibilityLabel={t.label}
                accessibilityState={{ selected: topic === t.value }}
                onPress={() => setTopic(t.value)}
                style={[styles.segment, topic === t.value && styles.segmentSelected]}
              >
                <Text style={[styles.segmentText, topic === t.value && styles.segmentTextSelected]}>{t.label}</Text>
              </Pressable>
            ))}
          </View>
          <FieldError field="topic" errors={errors} />

          <Text style={shared.label}>Reply via</Text>
          {['email', 'phone'].map((v) => (
            <Pressable
              key={v}
              testID={`via-${v}`}
              accessibilityRole="radio"
              accessibilityLabel={v}
              accessibilityState={{ checked: via === v }}
              onPress={() => setVia(v)}
              style={styles.radioRow}
            >
              <View style={[styles.radio, via === v && styles.radioChecked]} />
              <Text style={{ color: colors.text, fontSize: 16 }}>{v === 'email' ? 'Email' : 'Phone'}</Text>
            </Pressable>
          ))}
          <FieldError field="via" errors={errors} />

          <Text style={shared.label}>Message</Text>
          <TextInput
            testID="contact-message"
            accessibilityLabel="Message"
            style={[shared.input, { minHeight: 120, textAlignVertical: 'top' }]}
            value={message}
            onChangeText={setMessage}
            placeholder="At least 10 characters"
            multiline
          />
          <FieldError field="message" errors={errors} />

          <View style={styles.termsRow}>
            {/* A native switch: UISwitch on iOS, android.widget.Switch on Android. */}
            <Switch testID="terms-switch" accessibilityLabel="I accept the terms" value={terms} onValueChange={setTerms} />
            <Text style={{ flex: 1, color: colors.text }}>I accept the terms</Text>
          </View>
          <FieldError field="terms" errors={errors} />

          {errors.form ? <Text testID="contact-error" style={shared.error}>{errors.form}</Text> : null}

          <Button testID="send-button" title="Send" onPress={send} disabled={!terms || sending} />
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

function FieldError({ field, errors }: { field: string; errors: Record<string, string> }) {
  if (!errors[field]) return null;
  return (
    <Text testID={`error-${field}`} style={shared.error}>
      {errors[field]}
    </Text>
  );
}

const styles = StyleSheet.create({
  segments: { flexDirection: 'row', gap: 8 },
  segment: { flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingVertical: 10, alignItems: 'center', backgroundColor: colors.card },
  segmentSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { color: colors.text },
  segmentTextSelected: { color: '#fff', fontWeight: '600' },
  radioRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.border },
  radioChecked: { borderColor: colors.primary, backgroundColor: colors.primary },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  success: { fontSize: 18, color: colors.success, fontWeight: '600' },
});
