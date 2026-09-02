export function cycleIsActive(cycle) {
  const status = cycle?.cycleStatus || cycle?.status;
  return status === "current" || status === "registered";
}

export function normalizeCycleList(data) {
  return Array.isArray(data) ? data : (data?.cycles ?? []);
}

function cycleId(cycle) {
  return cycle?._id || cycle?.id || null;
}

export function resolveCycleAfterRefresh(cycles, selectedCycle = null) {
  const list = normalizeCycleList(cycles);
  const selectedId = cycleId(selectedCycle);

  if (selectedId) {
    const refreshedSelected = list.find((cycle) => cycleId(cycle) === selectedId);
    if (refreshedSelected) return refreshedSelected;

    if (!cycleIsActive(selectedCycle)) return selectedCycle;
  }

  return list.find(cycleIsActive) || null;
}
