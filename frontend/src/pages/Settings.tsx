import { useState } from 'react';
import { User, Bell, Shield, Palette, Save, Check } from 'lucide-react';
import { AppLayout } from '../components/AppLayout';
import { Card, CardHeader } from '../components/Card';
import { Badge } from '../components/RiskMeter';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    emailAlerts: true,
    smsAlerts: false,
    severeWeatherOnly: true,
    weeklyReport: true,
    riskThreshold: 'high',
    units: 'imperial',
    mapLayers: 'all',
  });

  const handleToggle = (key: keyof typeof settings) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppLayout breadcrumbs={[{ label: 'Dashboard', to: '/app' }, { label: 'Settings' }]}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-2xl font-bold text-ink-900">Settings</h1>
          <p className="text-sm text-ink-500 mt-1">Manage your account and platform preferences</p>
        </div>

        {/* Profile */}
        <Card>
          <CardHeader title="Profile" subtitle="Your account information" icon={<User className="w-5 h-5" />} />
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-2xl">
              {user?.email?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink-900">{user?.email ?? 'User'}</p>
              <p className="text-xs text-ink-500">Enterprise Plan · Member since 2025</p>
              <Badge variant="brand" className="mt-1.5">Admin</Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Full Name</label>
              <input type="text" defaultValue="Admin User" className="input" />
            </div>
            <div>
              <label className="label">Company</label>
              <input type="text" defaultValue="RiskIntel Enterprise" className="input" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input type="tel" placeholder="(555) 123-4567" className="input" />
            </div>
            <div>
              <label className="label">Role</label>
              <select className="input" defaultValue="admin">
                <option value="admin">Administrator</option>
                <option value="analyst">Risk Analyst</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader title="Notifications" subtitle="Configure weather and risk alerts" icon={<Bell className="w-5 h-5" />} />
          <div className="space-y-4">
            <ToggleRow
              label="Email Alerts"
              description="Receive weather alerts and risk notifications via email"
              checked={settings.emailAlerts}
              onChange={() => handleToggle('emailAlerts')}
            />
            <ToggleRow
              label="SMS Alerts"
              description="Get critical alerts via text message"
              checked={settings.smsAlerts}
              onChange={() => handleToggle('smsAlerts')}
            />
            <ToggleRow
              label="Severe Weather Only"
              description="Only notify for severe or extreme weather events"
              checked={settings.severeWeatherOnly}
              onChange={() => handleToggle('severeWeatherOnly')}
            />
            <ToggleRow
              label="Weekly Report"
              description="Receive a weekly summary of property risk changes"
              checked={settings.weeklyReport}
              onChange={() => handleToggle('weeklyReport')}
            />
          </div>
        </Card>

        {/* Risk Preferences */}
        <Card>
          <CardHeader title="Risk Preferences" subtitle="Customize risk thresholds and display" icon={<Shield className="w-5 h-5" />} />
          <div className="space-y-4">
            <div>
              <label className="label">Default Risk Threshold</label>
              <select
                value={settings.riskThreshold}
                onChange={(e) => setSettings({ ...settings, riskThreshold: e.target.value })}
                className="input"
              >
                <option value="low">Low (30+)</option>
                <option value="medium">Medium (50+)</option>
                <option value="high">High (60+)</option>
                <option value="critical">Critical (80+)</option>
              </select>
            </div>
            <div>
              <label className="label">Measurement Units</label>
              <div className="flex gap-3">
                <button
                  onClick={() => setSettings({ ...settings, units: 'imperial' })}
                  className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    settings.units === 'imperial' ? 'border-brand-500 bg-brand-50/50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-ink-300'
                  }`}
                >
                  Imperial (°F, mph, in)
                </button>
                <button
                  onClick={() => setSettings({ ...settings, units: 'metric' })}
                  className={`flex-1 p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    settings.units === 'metric' ? 'border-brand-500 bg-brand-50/50 text-brand-700' : 'border-ink-200 text-ink-600 hover:border-ink-300'
                  }`}
                >
                  Metric (°C, km/h, mm)
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader title="Appearance" subtitle="Customize map and display preferences" icon={<Palette className="w-5 h-5" />} />
          <div>
            <label className="label">Default Map Layers</label>
            <select
              value={settings.mapLayers}
              onChange={(e) => setSettings({ ...settings, mapLayers: e.target.value })}
              className="input"
            >
              <option value="all">All Layers</option>
              <option value="radar">Weather Radar Only</option>
              <option value="flood">Flood Zones Only</option>
              <option value="storm">Storm Tracks Only</option>
            </select>
          </div>
        </Card>

        {/* Save button */}
        <div className="flex items-center gap-3">
          <button onClick={handleSave} className="btn-primary">
            {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
          <button className="btn-secondary">Cancel</button>
        </div>
      </div>
    </AppLayout>
  );
}

function ToggleRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-ink-900">{label}</p>
        <p className="text-xs text-ink-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? 'bg-brand-600' : 'bg-ink-200'
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}
