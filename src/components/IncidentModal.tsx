import React from 'react';
import { Siren, ClipboardList, Satellite, Scale } from 'lucide-react';
import { type DynamicIncident } from '../data/eventsData';

interface IncidentModalProps {
  incident: DynamicIncident;
  onResolveChoice: (choiceId: string) => void;
}

export const IncidentModal: React.FC<IncidentModalProps> = ({ incident, onResolveChoice }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-[var(--color-deck)] border-4 border-[var(--color-line)] rounded-3xl max-w-lg w-full p-6 shadow-2xl text-[var(--color-regolith)]">
        <div className="flex items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--color-action)] text-white text-xs font-black rounded-full uppercase">
            {incident.isScripted ? (
              <>
                <Siren className="w-3.5 h-3.5" /> Alerte de mission
              </>
            ) : (
              <>
                <ClipboardList className="w-3.5 h-3.5" /> Événement
              </>
            )}
          </span>
          <span className="text-xs font-bold text-[var(--color-dust)]">Jour {incident.day} sur 30</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-1">{incident.title}</h2>
        <p className="text-sm font-bold text-[var(--color-dust)] mb-4">{incident.subtitle}</p>

        <p className="text-base font-semibold text-slate-200 bg-[var(--color-deck-raised)] p-4 rounded-2xl border-2 border-[var(--color-line)] mb-4 leading-relaxed">
          {incident.description}
        </p>

        {/* Real NASA DONKI Satellite Citation Badge */}
        {incident.nasaContext && (
          <div className="mb-6 p-4 rounded-2xl bg-blue-950/80 border-2 border-blue-500/40 text-xs text-blue-100 space-y-1">
            <div className="font-black flex items-center gap-1.5 text-blue-300">
              <Satellite className="w-4 h-4 text-blue-400" />
              <span>Donnée satellite NASA DONKI</span>
            </div>
            <div>Date : {incident.nasaContext.eventTime}</div>
            <div>Instruments : {incident.nasaContext.instruments.join(', ') || 'SOHO / STEREO'}</div>
            <div className="italic text-[11px] mt-2 text-blue-300/80">{incident.nasaContext.disclaimer}</div>
          </div>
        )}

        <div className="space-y-3">
          {incident.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onResolveChoice(choice.id)}
              className="w-full text-left p-4 rounded-2xl border-2 border-[var(--color-line)] bg-slate-800 hover:bg-slate-700 hover:border-[var(--color-action)] btn-chunky transition cursor-pointer text-white"
            >
              <div className="font-black text-base text-white">{choice.label}</div>
              <div className="text-xs font-semibold text-slate-300 mt-1">{choice.kidDescription}</div>
              <div className="text-xs font-bold text-amber-400 mt-1.5 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5" /> Compromis : {choice.tradeoffExplanation}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};