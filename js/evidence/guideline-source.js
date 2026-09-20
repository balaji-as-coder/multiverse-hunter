/**
 * MULTIVERSE HUNTER — GUIDELINE SOURCE & CITATION SCHEMA
 * Canonical clinical and sports science references indexing all health,
 * nutrition, biomechanics, and recovery algorithms.
 */

class GuidelineSource {
    constructor(sourceId, name, author, year, publication, url, evidenceGrade) {
        this.sourceId = sourceId;
        this.name = name;
        this.author = author;
        this.year = year;
        this.publication = publication;
        this.url = url || '';
        this.evidenceGrade = evidenceGrade; // 'A' (Meta-analysis / RCT), 'B' (Cohort / Clinical Guideline), 'C' (Consensus / Position Stand), 'D' (Expert Practice)
    }
}

const CANONICAL_SOURCES = {
    ICMR_2024: new GuidelineSource(
        'ICMR_2024',
        'Dietary Guidelines for Indians',
        'Indian Council of Medical Research - National Institute of Nutrition (ICMR-NIN)',
        2024,
        'Government of India Health Ministry Publications',
        'https://www.nin.res.in',
        'A'
    ),
    ISSN_2017: new GuidelineSource(
        'ISSN_2017',
        'Position Stand: Diets and Body Composition',
        'Aragon, A. A., Schoenfeld, B. J., Wildman, R., et al.',
        2017,
        'Journal of the International Society of Sports Nutrition (JISSN)',
        'https://doi.org/10.1186/s12970-017-0174-y',
        'A'
    ),
    HELMS_2014: new GuidelineSource(
        'HELMS_2014',
        'Evidence-based recommendations for natural bodybuilding contest prep: nutrition and supplementation',
        'Helms, E. R., Aragon, A. A., & Fitschen, P. J.',
        2014,
        'Journal of the International Society of Sports Nutrition',
        'https://doi.org/10.1186/1550-2783-11-20',
        'B'
    ),
    SCHOENFELD_2021: new GuidelineSource(
        'SCHOENFELD_2021',
        'Resistance Training Recommendations to Maximize Muscle Hypertrophy',
        'Schoenfeld, B. J., Grgic, J., Van Every, D. W., & Plotkin, D. L.',
        2021,
        'International Journal of Environmental Research and Public Health',
        'https://doi.org/10.3390/ijerph18168665',
        'A'
    ),
    MORTON_2018: new GuidelineSource(
        'MORTON_2018',
        'A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training adaptations',
        'Morton, R. W., Murphy, K. T., McKellar, S. R., et al.',
        2018,
        'British Journal of Sports Medicine (BJSM)',
        'https://doi.org/10.1136/bjsports-2017-097608',
        'A'
    ),
    ACSM_2018: new GuidelineSource(
        'ACSM_2018',
        'ACSM Guidelines for Exercise Testing and Prescription',
        'American College of Sports Medicine',
        2018,
        'Wolters Kluwer Health',
        'https://www.acsm.org',
        'A'
    )
};

if (typeof window !== 'undefined') {
    window.GuidelineSource = GuidelineSource;
    window.CANONICAL_SOURCES = CANONICAL_SOURCES;
}
