import { useLocale } from "../locale/Locale";
import { ClientSettings as Settings } from "../services/ClientSettings";
import { LANGUAGES, LocaleName } from "../locale/locale.config";

type ClientSettingsProps = {
  onClose: () => void;
}

export function ClientSettings({onClose}: ClientSettingsProps) {
  const l = useLocale();
  const s = Settings.getInstance();
  return (
    <>
      <div className="client-settings-popup">
        <div className="client-settings-modal">
          <button className="client-settings-close" type="button" aria-label="Close" onClick={onClose}>×</button>

          <div className="client-settings-header">
            <h1 className="client-settings-title">
              {l.t("clientsettings.title")}
            </h1>
          </div>
          <div className="client-settings-row">
            <div className="client-settings-label-group">
              <label className="client-settings-row-title">
                {l.t("clientsettings.locale.title")}
              </label>
              <div className="client-settings-toolbox">
                <span className="client-settings-toolbox-icon">ℹ</span>
              
                <div className="client-settings-toolbox-content">
                  {l.t("clientsettings.locale.description")}
                </div>
              </div>
            </div>
            <select
              className="client-settings-select"
              value={l.name}
              onChange={(e) => s.setLocale(e.target.value as LocaleName)}
            >
              {LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
