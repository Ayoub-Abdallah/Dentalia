import React, { useState, useEffect } from 'react';
import { Patient, Treatment } from '../types';
import { calculateAge } from '../utils/dateUtils';
import { Calendar, Edit2, Trash2, FileText, X, Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { treatmentService } from '../lib/treatmentService';
import { toast } from 'react-hot-toast';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from 'docx';

interface PatientsTableProps {
  patients: Patient[];
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  onCreateAppointment?: (patient: Patient) => void;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({
  patients,
  onEdit,
  onDelete,
  onCreateAppointment,
}) => {
  const { t } = useTranslation();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showTreatmentsModal, setShowTreatmentsModal] = useState(false);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [isLoadingTreatments, setIsLoadingTreatments] = useState(false);

  const renderAge = (patient: Patient) => {
    if (patient.dateOfBirth) {
      return (
        <>
          <div className="text-sm text-gray-900">
            {calculateAge(patient.dateOfBirth)} {t('patients.years')}
          </div>
          <div className="text-sm text-gray-500">
            {new Date(patient.dateOfBirth).toLocaleDateString()}
          </div>
        </>
      );
    }
    return (
      <div className="text-sm text-gray-900">
        {patient.age} {t('patients.years')}
      </div>
    );
  };

  const handleViewTreatments = async (patient: Patient) => {
    console.log('handleViewTreatments called with patient:', patient);
    
    if (!patient._id) {
      console.error('Invalid patient ID:', patient);
      toast.error(t('patients.invalidPatientId'));
      return;
    }

    console.log('Setting selected patient and showing modal');
    setSelectedPatient(patient);
    setShowTreatmentsModal(true);
    setIsLoadingTreatments(true);

    try {
      console.log('Fetching treatments for patient ID:', patient._id);
      const patientTreatments = await treatmentService.getTreatmentsByPatient(patient._id);
      console.log('Received treatments:', patientTreatments);
      
      if (!Array.isArray(patientTreatments)) {
        console.error('Treatments is not an array:', patientTreatments);
        toast.error(t('patients.invalidTreatmentsData'));
        return;
      }
      
      console.log('Setting treatments state with:', patientTreatments);
      setTreatments(patientTreatments);
    } catch (error) {
      console.error('Error in handleViewTreatments:', error);
      toast.error(t('patients.errorFetchingTreatments'));
    } finally {
      console.log('Setting loading state to false');
      setIsLoadingTreatments(false);
    }
  };

  const handlePrintTreatment = (treatment: Treatment) => {
    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: t('patients.treatmentDetails'),
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 200,
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${t('patients.type')}: `,
                bold: true,
              }),
              new TextRun(treatment.type),
            ],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${t('patients.date')}: `,
                bold: true,
              }),
              new TextRun(new Date(treatment.date).toLocaleDateString()),
            ],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${t('patients.status')}: `,
                bold: true,
              }),
              new TextRun(treatment.status),
            ],
            spacing: {
              after: 100,
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${t('patients.description')}: `,
                bold: true,
              }),
              new TextRun(treatment.description),
            ],
            spacing: {
              after: 100,
            },
          }),
          ...(treatment.notes ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${t('patients.notes')}: `,
                  bold: true,
                }),
                new TextRun(treatment.notes),
              ],
              spacing: {
                after: 100,
              },
            }),
          ] : []),
          ...(treatment.cost ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${t('patients.cost')}: `,
                  bold: true,
                }),
                new TextRun(treatment.cost.toString()),
              ],
              spacing: {
                after: 100,
              },
            }),
          ] : []),
          new Paragraph({
            text: new Date().toLocaleDateString(),
            alignment: AlignmentType.CENTER,
            spacing: {
              before: 400,
            },
          }),
        ],
      }],
    });

    // Generate and download the document
    Packer.toBlob(doc).then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `treatment_${treatment.type}_${new Date(treatment.date).toLocaleDateString()}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('patients.name')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('patients.age')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('patients.contact')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('patients.gender')}
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t('patients.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {patient.firstName} {patient.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {renderAge(patient)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{patient.email}</div>
                  <div className="text-sm text-gray-500">{patient.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {patient.gender || t('patients.notSpecified')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleViewTreatments(patient)}
                    className="text-purple-600 hover:text-purple-900 mr-4"
                    title={t('patients.viewTreatments')}
                  >
                    <FileText className="w-5 h-5" />
                  </button>
                  {onCreateAppointment && (
                    <button
                      onClick={() => onCreateAppointment(patient)}
                      className="text-green-600 hover:text-green-900 mr-4"
                      title={t('patients.createAppointment')}
                    >
                      <Calendar className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={() => onEdit(patient)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                    title={t('patients.edit')}
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => onDelete(patient._id!)}
                    className="text-red-600 hover:text-red-900"
                    title={t('patients.delete')}
                    disabled={!patient._id}
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Treatments Modal */}
      {showTreatmentsModal && selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-xl font-semibold">
                {t('patients.treatmentsFor')} {selectedPatient.firstName} {selectedPatient.lastName}
              </h2>
              <button
                onClick={() => {
                  setShowTreatmentsModal(false);
                  setSelectedPatient(null);
                  setTreatments([]);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">{t('patients.patientInfo')}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">{t('patients.name')}:</span>
                    <span className="ml-2 font-medium">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('patients.age')}:</span>
                    <span className="ml-2 font-medium">
                      {selectedPatient.dateOfBirth
                        ? `${calculateAge(selectedPatient.dateOfBirth)} ${t('patients.years')}`
                        : `${selectedPatient.age} ${t('patients.years')}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">{t('patients.dateOfBirth')}:</span>
                    <span className="ml-2 font-medium">
                      {selectedPatient.dateOfBirth
                        ? new Date(selectedPatient.dateOfBirth).toLocaleDateString()
                        : t('patients.notSpecified')}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">{t('patients.treatments')}</h3>
                {isLoadingTreatments ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : treatments.length > 0 ? (
                  <div className="space-y-4">
                    {treatments.map((treatment, index) => (
                      <div key={treatment._id || index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="font-medium">{treatment.type}</span>
                            <span className="text-gray-500 ml-2">
                              {new Date(treatment.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              treatment.status === 'completed' ? 'bg-green-100 text-green-800' :
                              treatment.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                              'bg-yellow-100 text-yellow-800'
                            }`}>
                              {treatment.status}
                            </span>
                            <button
                              onClick={() => handlePrintTreatment(treatment)}
                              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                              title={t('patients.printTreatment')}
                            >
                              <Printer className="h-4 w-4 text-gray-500" />
                            </button>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          {treatment.description}
                        </div>
                        {treatment.notes && (
                          <div className="mt-2 text-sm text-gray-500">
                            {treatment.notes}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">
                    {t('patients.noTreatments')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 