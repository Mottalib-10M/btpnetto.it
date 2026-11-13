/** Jour du build (UTC), identique au serveur et dans le navigateur (défini par astro.config, `__BUILD_DAY__`) :
 *  les calculs partent de ce jour, et la page le dit (« calcolato al … »). Aucun écart d'hydratation (RECETTE §17.5). */
export const BUILD_TODAY: string = typeof __BUILD_DAY__ !== 'undefined' ? __BUILD_DAY__ : new Date().toISOString().slice(0, 10);
