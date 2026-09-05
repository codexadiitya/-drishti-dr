import { useState } from 'react';
import {
  Bell, MessageSquare, Mail, Phone, Calendar, Send,
  CheckCircle2, Clock, AlertCircle, Users, ChevronDown,
  Search,
} from 'lucide-react';
import { MOCK_PATIENTS } from '../lib/mockData';

// Extend patients with contact info for reminders
const PATIENT_CONTACTS = MOCK_PATIENTS.map((p, i) => ({
  ...p,
  name: ['Rajesh Kumar', 'Sunita Devi', 'Mohammed Salim', 'Kamala Bai', 'Suresh Verma', 'Priya Nair', 'Deepak Singh', 'Lakshmi Rao'][i] ?? `Patient ${p.id}`,
  phone: [`+91 98765 ${43210 + i}`, `+91 87654 ${32109 + i}`, `+91 76543 ${21098 + i}`, `+91 65432 ${10987 + i}`, `+91 54321 ${9876 + i}`, `+91 43210 ${98765 + i}`, `+91 32109 ${87654 + i}`, `+91 21098 ${76543 + i}`][i] ?? '+91 99999 00000',
  email: [`rajesh.kumar@gmail.com`, `sunita.devi@yahoo.com`, `m.salim@gmail.com`, `kamala.bai@gmail.com`, `suresh.v@outlook.com`, `priya.nair@gmail.com`, `deepak.singh@gmail.com`, `lakshmi.rao@gmail.com`][i] ?? 'patient@email.com',
  nextAppointment: ['2026-09-10', '2026-09-12', '2026-09-08', '2026-09-15', '2026-09-18', '2026-09-20', '2026-09-09', '2026-09-14'][i] ?? '2026-09-30',
}));

type ChannelType = 'sms' | 'email' | 'both';
type ReminderType = 'appointment' | 'followup' | 'referral' | 'general';

const REMINDER_TYPES: { value: ReminderType; label: string; desc: string }[] = [
  { value: 'appointment', label: 'Appointment Reminder', desc: 'Remind patient about upcoming visit' },
  { value: 'followup', label: 'Follow-up Reminder', desc: 'Remind about follow-up checkup' },
  { value: 'referral', label: 'Referral Notification', desc: 'Inform about specialist referral' },
  { value: 'general', label: 'General Update', desc: 'Send test results or general info' },
];

const MESSAGE_TEMPLATES: Record<ReminderType, string> = {
  appointment: `Dear {name}, this is a reminder from NetraRakshaq Clinic. Your retinal screening appointment is scheduled on {date}. Please arrive 10 minutes early. Bring your diabetic care card. For help, call our helpline: 1800-XXX-XXXX.`,
  followup: `Dear {name}, your recent screening results are ready. Please schedule a follow-up visit at your earliest convenience. Contact us at 1800-XXX-XXXX or visit our clinic during working hours (9am – 5pm).`,
  referral: `Dear {name}, based on your recent retinal screening, our AI system has flagged a concern that requires specialist attention. Please visit an ophthalmologist within the next 7 days. We have sent your referral letter. Call 1800-XXX-XXXX for assistance.`,
  general: `Dear {name}, this is a message from NetraRakshaq. Your recent eye screening results are now available. Please contact your care team or visit our clinic for details. Helpline: 1800-XXX-XXXX.`,
};

interface SentLog {
  id: string;
  patientName: string;
  patientId: string;
  type: string;
  channel: string;
  sentAt: string;
  status: 'delivered' | 'sent' | 'failed';
}

const INITIAL_LOG: SentLog[] = [
  { id: 'R001', patientName: 'Kamala Bai', patientId: 'PT-10024', type: 'Referral Notification', channel: 'SMS + Email', sentAt: '2026-09-02 08:45', status: 'delivered' },
  { id: 'R002', patientName: 'Deepak Singh', patientId: 'PT-10027', type: 'Referral Notification', channel: 'SMS', sentAt: '2026-09-02 09:12', status: 'delivered' },
  { id: 'R003', patientName: 'Rajesh Kumar', patientId: 'PT-10021', type: 'Appointment Reminder', channel: 'Email', sentAt: '2026-09-01 14:30', status: 'sent' },
  { id: 'R004', patientName: 'Sunita Devi', patientId: 'PT-10022', type: 'Follow-up Reminder', channel: 'SMS', sentAt: '2026-09-01 11:20', status: 'delivered' },
];

function StatusPill({ status }: { status: SentLog['status'] }) {
  const styles = {
    delivered: 'bg-green-50 text-green-700 border-green-200',
    sent: 'bg-blue-50 text-blue-700 border-blue-200',
    failed: 'bg-red-50 text-red-700 border-red-200',
  };
  const icons = {
    delivered: <CheckCircle2 size={11} />,
    sent: <Clock size={11} />,
    failed: <AlertCircle size={11} />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full border ${styles[status]}`}>
      {icons[status]} {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export function Reminders() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [reminderType, setReminderType] = useState<ReminderType>('appointment');
  const [channel, setChannel] = useState<ChannelType>('both');
  const [appointmentDate, setAppointmentDate] = useState('2026-09-10');
  const [customMessage, setCustomMessage] = useState('');
  const [log, setLog] = useState<SentLog[]>(INITIAL_LOG);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const filteredPatients = PATIENT_CONTACTS.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  function togglePatient(id: string) {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (selected.size === filteredPatients.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filteredPatients.map(p => p.id)));
    }
  }

  const previewMessage = (name = '{patient name}') => {
    const base = customMessage || MESSAGE_TEMPLATES[reminderType];
    return base.replace('{name}', name).replace('{date}', appointmentDate);
  };

  async function handleSend() {
    if (selected.size === 0) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));

    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const channelLabel = channel === 'both' ? 'SMS + Email' : channel === 'sms' ? 'SMS' : 'Email';
    const typeLabel = REMINDER_TYPES.find(r => r.value === reminderType)?.label ?? reminderType;

    const newEntries: SentLog[] = Array.from(selected).map((pid, i) => {
      const patient = PATIENT_CONTACTS.find(p => p.id === pid);
      return {
        id: `R${Date.now()}${i}`,
        patientName: patient?.name ?? pid,
        patientId: pid,
        type: typeLabel,
        channel: channelLabel,
        sentAt: timestamp,
        status: 'delivered' as const,
      };
    });

    setLog(prev => [...newEntries, ...prev]);
    setSending(false);
    setSent(true);
    setSelected(new Set());
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">Patient Reminders</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Send appointment reminders and health updates to patients via SMS or email.
        </p>
      </div>

      {/* Success banner */}
      {sent && (
        <div className="flex items-center gap-3 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm font-medium">
          <CheckCircle2 size={16} className="text-green-600 flex-shrink-0" />
          Reminders sent successfully to {selected.size || log.length} patients.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* ── LEFT: Patient selector ─────────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 card-shadow overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users size={15} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-800">Select Patients</span>
            </div>
            <button
              onClick={toggleAll}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
            >
              {selected.size === filteredPatients.length ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          {/* Search */}
          <div className="px-3 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">
              <Search size={13} className="text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by name or ID…"
                className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none w-full"
              />
            </div>
          </div>

          {/* Patient list */}
          <div className="overflow-y-auto max-h-80">
            {filteredPatients.map(p => {
              const isSelected = selected.has(p.id);
              return (
                <label
                  key={p.id}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => togglePatient(p.id)}
                    className="mt-0.5 w-4 h-4 accent-blue-600 cursor-pointer flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800 truncate">{p.name}</span>
                      {p.referable && (
                        <span className="text-[10px] font-medium text-red-600 bg-red-50 border border-red-100 px-1.5 py-0.5 rounded-full flex-shrink-0">
                          Referred
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-gray-400 font-mono">{p.id}</span>
                      <span className="text-[11px] text-gray-400">Age {p.age}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
                      <Phone size={9} />
                      <span>{p.phone}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-[11px] text-blue-400">
                      <Calendar size={9} />
                      <span>Next appt: {p.nextAppointment}</span>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Selection count */}
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              {selected.size === 0 ? 'No patients selected' : `${selected.size} patient${selected.size > 1 ? 's' : ''} selected`}
            </p>
          </div>
        </div>

        {/* ── RIGHT: Compose ─────────────────────────────────────── */}
        <div className="lg:col-span-3 flex flex-col gap-4">
          {/* Reminder type */}
          <div className="bg-white rounded-xl border border-gray-200 card-shadow p-5">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Reminder Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {REMINDER_TYPES.map(r => (
                <label
                  key={r.value}
                  className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition-all ${
                    reminderType === r.value
                      ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reminderType"
                    value={r.value}
                    checked={reminderType === r.value}
                    onChange={() => { setReminderType(r.value); setCustomMessage(''); }}
                    className="mt-0.5 accent-blue-600 flex-shrink-0"
                  />
                  <div>
                    <p className={`text-xs font-semibold ${reminderType === r.value ? 'text-blue-700' : 'text-gray-700'}`}>{r.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">{r.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Channel + Date */}
          <div className="bg-white rounded-xl border border-gray-200 card-shadow p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm font-semibold text-gray-800 block mb-2">Send via</label>
                <div className="flex gap-2">
                  {([
                    { value: 'sms', label: 'SMS', icon: MessageSquare },
                    { value: 'email', label: 'Email', icon: Mail },
                    { value: 'both', label: 'Both', icon: Bell },
                  ] as { value: ChannelType; label: string; icon: typeof Bell }[]).map(c => (
                    <button
                      key={c.value}
                      onClick={() => setChannel(c.value)}
                      className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        channel === c.value
                          ? 'border-blue-400 bg-blue-50 text-blue-700'
                          : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <c.icon size={16} />
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-800 block mb-2">Appointment date</label>
                <input
                  type="date"
                  value={appointmentDate}
                  onChange={e => setAppointmentDate(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Message preview + edit */}
          <div className="bg-white rounded-xl border border-gray-200 card-shadow p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-semibold text-gray-800">Message Preview</h3>
              <button
                onClick={() => setCustomMessage(MESSAGE_TEMPLATES[reminderType])}
                className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                Edit message
              </button>
            </div>

            {customMessage ? (
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                rows={5}
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none font-sans"
              />
            ) : (
              <div className="bg-gray-50 rounded-lg border border-gray-100 p-3.5">
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {previewMessage('Rajesh Kumar')}
                </p>
              </div>
            )}

            <p className="text-[10px] text-gray-400 mt-2 flex items-center gap-1">
              <span className="font-mono bg-gray-100 px-1 rounded">{'{name}'}</span>
              will be replaced with each patient's actual name.
            </p>
          </div>

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={selected.size === 0 || sending}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer disabled:cursor-not-allowed shadow-sm"
          >
            {sending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Sending reminders…
              </>
            ) : (
              <>
                <Send size={16} />
                Send Reminders
                {selected.size > 0 && <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{selected.size}</span>}
              </>
            )}
          </button>

          {selected.size === 0 && !sending && (
            <p className="text-center text-xs text-gray-400 -mt-2">Select at least one patient to enable sending</p>
          )}
        </div>
      </div>

      {/* Reminder history */}
      <div className="bg-white rounded-xl border border-gray-200 card-shadow overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Clock size={15} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-800">Recent Reminders Sent</h2>
          <span className="ml-auto text-xs text-gray-400">{log.length} total</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                {['Patient', 'ID', 'Reminder Type', 'Channel', 'Sent at', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {log.map(entry => (
                <tr key={entry.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-800">{entry.patientName}</td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{entry.patientId}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{entry.type}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      {entry.channel.includes('SMS') && <MessageSquare size={11} />}
                      {entry.channel.includes('Email') && <Mail size={11} />}
                      {entry.channel}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">{entry.sentAt}</td>
                  <td className="px-4 py-3"><StatusPill status={entry.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          {log.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No reminders sent yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}
