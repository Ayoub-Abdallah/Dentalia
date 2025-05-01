import { useEffect } from 'react';
import { useTreatmentPlanStore } from '../store/treatmentPlanStore';
import { toast } from 'react-hot-toast';
import type { TreatmentPlan } from '../types';

export default function TreatmentPlans() {
  const { treatmentPlans, isLoading, error, fetchTreatmentPlans } = useTreatmentPlanStore();

  useEffect(() => {
    fetchTreatmentPlans();
  }, [fetchTreatmentPlans]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Treatment Plans</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {treatmentPlans.map((plan: TreatmentPlan) => (
          <div key={plan._id} className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold">{plan.patientId}</h2>
            <p className="text-gray-600">Status: {plan.status}</p>
            <p className="text-gray-600">Start Date: {new Date(plan.startDate).toLocaleDateString()}</p>
            <p className="text-gray-600">Total Cost: DA {plan.totalCost}</p>
            <div className="mt-2">
              <h3 className="font-medium">Treatments:</h3>
              <ul className="list-disc list-inside">
                {plan.treatments.map((treatment, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    {treatment.treatmentId} - {treatment.status}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 