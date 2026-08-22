/**
 * Deterministic seed data. Ids are stable slugs — rerunning the seed updates
 * these rows in place rather than creating new ones.
 */

export const DOMAINS = [
  { id: 'domain-software-engineering', name: 'Software Engineering' },
  { id: 'domain-data', name: 'Data' },
  { id: 'domain-ai-ml', name: 'AI & ML' },
  { id: 'domain-platform', name: 'Platform & Infrastructure' },
];

export const ROLES = [
  { id: 'role-frontend-engineer', title: 'Frontend Engineer', level: 'mid', domainId: 'domain-software-engineering' },
  { id: 'role-backend-engineer', title: 'Backend Engineer', level: 'mid', domainId: 'domain-software-engineering' },
  { id: 'role-senior-backend-engineer', title: 'Senior Backend Engineer', level: 'senior', domainId: 'domain-software-engineering' },
  { id: 'role-full-stack-engineer', title: 'Full Stack Engineer', level: 'senior', domainId: 'domain-software-engineering' },
  { id: 'role-data-analyst', title: 'Data Analyst', level: 'mid', domainId: 'domain-data' },
  { id: 'role-analytics-engineer', title: 'Analytics Engineer', level: 'mid', domainId: 'domain-data' },
  { id: 'role-data-engineer', title: 'Data Engineer', level: 'senior', domainId: 'domain-data' },
  { id: 'role-ml-engineer', title: 'Machine Learning Engineer', level: 'senior', domainId: 'domain-ai-ml' },
  { id: 'role-senior-ai-engineer', title: 'Senior AI Engineer', level: 'senior', domainId: 'domain-ai-ml' },
  { id: 'role-platform-engineer', title: 'Platform Engineer', level: 'senior', domainId: 'domain-platform' },
];

export const SKILLS = [
  { id: 'skill-javascript', name: 'JavaScript', description: 'The language the browser actually runs.' },
  { id: 'skill-typescript', name: 'TypeScript', description: 'Static types over JavaScript, for code that outlives its author.' },
  { id: 'skill-python', name: 'Python', description: 'General-purpose language and the default for data and ML work.' },
  { id: 'skill-sql', name: 'SQL', description: 'Querying and shaping relational data.' },
  { id: 'skill-html-css', name: 'HTML & CSS', description: 'Structure and presentation on the web.' },
  { id: 'skill-react', name: 'React', description: 'Component-based user interfaces.' },
  { id: 'skill-state-management', name: 'State Management', description: 'Keeping UI state predictable as an application grows.' },
  { id: 'skill-web-accessibility', name: 'Web Accessibility', description: 'Building interfaces that work for everyone, including assistive technology.' },
  { id: 'skill-frontend-testing', name: 'Frontend Testing', description: 'Automated tests for component behaviour and user flows.' },
  { id: 'skill-nodejs', name: 'Node.js', description: 'Server-side JavaScript runtime.' },
  { id: 'skill-rest-api-design', name: 'REST API Design', description: 'Designing HTTP interfaces other teams can use without asking you.' },
  { id: 'skill-relational-databases', name: 'Relational Databases', description: 'Schema design, indexing, and transactions.' },
  { id: 'skill-system-design', name: 'System Design', description: 'Structuring services and data flow at scale.' },
  { id: 'skill-caching', name: 'Caching', description: 'Trading freshness for speed, deliberately.' },
  { id: 'skill-data-modelling', name: 'Data Modelling', description: 'Representing a domain so queries stay simple.' },
  { id: 'skill-etl-pipelines', name: 'ETL Pipelines', description: 'Moving and reshaping data on a schedule, reliably.' },
  { id: 'skill-data-warehousing', name: 'Data Warehousing', description: 'Storing analytical data for querying at scale.' },
  { id: 'skill-apache-spark', name: 'Apache Spark', description: 'Distributed processing for datasets too large for one machine.' },
  { id: 'skill-data-visualisation', name: 'Data Visualisation', description: 'Turning results into something a person can read.' },
  { id: 'skill-business-intelligence', name: 'Business Intelligence', description: 'Reporting and metrics that inform decisions.' },
  { id: 'skill-mathematics-for-ml', name: 'Mathematics for ML', description: 'Calculus and optimisation underpinning model training.' },
  { id: 'skill-linear-algebra', name: 'Linear Algebra', description: 'Vectors and matrices — the arithmetic of every model.' },
  { id: 'skill-statistics', name: 'Statistics', description: 'Distributions, inference, and knowing when a result means nothing.' },
  { id: 'skill-machine-learning', name: 'Machine Learning', description: 'Training models to generalise from data.' },
  { id: 'skill-deep-learning', name: 'Deep Learning', description: 'Neural networks and the training techniques that make them work.' },
  { id: 'skill-llm-engineering', name: 'LLM Engineering', description: 'Building applications on top of large language models.' },
  { id: 'skill-prompt-engineering', name: 'Prompt Engineering', description: 'Getting reliable behaviour out of a language model.' },
  { id: 'skill-vector-databases', name: 'Vector Databases', description: 'Storing and searching embeddings by similarity.' },
  { id: 'skill-mlops', name: 'MLOps', description: 'Deploying, monitoring, and retraining models in production.' },
  { id: 'skill-containerisation', name: 'Containerisation', description: 'Packaging software so it runs the same everywhere.' },
  { id: 'skill-container-orchestration', name: 'Container Orchestration', description: 'Scheduling and scaling containers across machines.' },
  { id: 'skill-ci-cd', name: 'CI/CD', description: 'Automated build, test, and release pipelines.' },
  { id: 'skill-cloud-infrastructure', name: 'Cloud Infrastructure', description: 'Provisioning and operating managed cloud services.' },
];

export const TOOLS = [
  { id: 'tool-jupyter', name: 'Jupyter', category: 'Notebook' },
  { id: 'tool-scikit-learn', name: 'scikit-learn', category: 'Library' },
  { id: 'tool-pytorch', name: 'PyTorch', category: 'Framework' },
  { id: 'tool-tensorflow', name: 'TensorFlow', category: 'Framework' },
  { id: 'tool-hugging-face', name: 'Hugging Face', category: 'Platform' },
  { id: 'tool-langchain', name: 'LangChain', category: 'Framework' },
  { id: 'tool-pinecone', name: 'Pinecone', category: 'Database' },
  { id: 'tool-pandas', name: 'pandas', category: 'Library' },
  { id: 'tool-numpy', name: 'NumPy', category: 'Library' },
  { id: 'tool-airflow', name: 'Apache Airflow', category: 'Platform' },
  { id: 'tool-dbt', name: 'dbt', category: 'Framework' },
  { id: 'tool-snowflake', name: 'Snowflake', category: 'Platform' },
  { id: 'tool-tableau', name: 'Tableau', category: 'Platform' },
  { id: 'tool-postgresql', name: 'PostgreSQL', category: 'Database' },
  { id: 'tool-docker', name: 'Docker', category: 'Platform' },
  { id: 'tool-kubernetes', name: 'Kubernetes', category: 'Platform' },
  { id: 'tool-github-actions', name: 'GitHub Actions', category: 'Platform' },
  { id: 'tool-mlflow', name: 'MLflow', category: 'Platform' },
];

/** importance: 'core' | 'important' | 'supporting' */
export const ROLE_REQUIREMENTS = [
  // Senior AI Engineer — Avery's target.
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-python', importance: 'core' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-machine-learning', importance: 'core' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-deep-learning', importance: 'core' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-llm-engineering', importance: 'core' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-statistics', importance: 'core' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-mathematics-for-ml', importance: 'important' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-prompt-engineering', importance: 'important' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-vector-databases', importance: 'important' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-mlops', importance: 'important' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-system-design', importance: 'supporting' },
  { roleId: 'role-senior-ai-engineer', skillId: 'skill-containerisation', importance: 'supporting' },

  // Full Stack Engineer — Jordan's target.
  { roleId: 'role-full-stack-engineer', skillId: 'skill-javascript', importance: 'core' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-typescript', importance: 'core' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-react', importance: 'core' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-nodejs', importance: 'core' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-rest-api-design', importance: 'core' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-html-css', importance: 'important' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-relational-databases', importance: 'important' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-sql', importance: 'important' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-frontend-testing', importance: 'supporting' },
  { roleId: 'role-full-stack-engineer', skillId: 'skill-system-design', importance: 'supporting' },

  // Data Engineer — Sam's target.
  { roleId: 'role-data-engineer', skillId: 'skill-sql', importance: 'core' },
  { roleId: 'role-data-engineer', skillId: 'skill-python', importance: 'core' },
  { roleId: 'role-data-engineer', skillId: 'skill-data-modelling', importance: 'core' },
  { roleId: 'role-data-engineer', skillId: 'skill-etl-pipelines', importance: 'core' },
  { roleId: 'role-data-engineer', skillId: 'skill-data-warehousing', importance: 'important' },
  { roleId: 'role-data-engineer', skillId: 'skill-apache-spark', importance: 'important' },
  { roleId: 'role-data-engineer', skillId: 'skill-cloud-infrastructure', importance: 'important' },
  { roleId: 'role-data-engineer', skillId: 'skill-containerisation', importance: 'supporting' },
  { roleId: 'role-data-engineer', skillId: 'skill-ci-cd', importance: 'supporting' },

  // The three current roles, so requirements exist on both sides of a transition.
  { roleId: 'role-senior-backend-engineer', skillId: 'skill-nodejs', importance: 'core' },
  { roleId: 'role-senior-backend-engineer', skillId: 'skill-rest-api-design', importance: 'core' },
  { roleId: 'role-senior-backend-engineer', skillId: 'skill-relational-databases', importance: 'core' },
  { roleId: 'role-senior-backend-engineer', skillId: 'skill-system-design', importance: 'important' },
  { roleId: 'role-senior-backend-engineer', skillId: 'skill-caching', importance: 'supporting' },

  { roleId: 'role-frontend-engineer', skillId: 'skill-html-css', importance: 'core' },
  { roleId: 'role-frontend-engineer', skillId: 'skill-javascript', importance: 'core' },
  { roleId: 'role-frontend-engineer', skillId: 'skill-react', importance: 'core' },
  { roleId: 'role-frontend-engineer', skillId: 'skill-state-management', importance: 'important' },
  { roleId: 'role-frontend-engineer', skillId: 'skill-web-accessibility', importance: 'important' },

  { roleId: 'role-data-analyst', skillId: 'skill-sql', importance: 'core' },
  { roleId: 'role-data-analyst', skillId: 'skill-data-visualisation', importance: 'core' },
  { roleId: 'role-data-analyst', skillId: 'skill-business-intelligence', importance: 'important' },
  { roleId: 'role-data-analyst', skillId: 'skill-statistics', importance: 'important' },
];

/**
 * strength 0.0-1.0: how strongly the first skill gates the second.
 *
 *   Mathematics for ML ─► Statistics ─► Machine Learning ─► Deep Learning ─► LLM Engineering
 *   Linear Algebra ─────────────────────────► ▲                                    ▲
 *   Python ─────────────────────────────────► ▲          Prompt Engineering ───────┤
 *                                                        Vector Databases ─────────┘
 */
export const PREREQUISITES = [
  { fromId: 'skill-mathematics-for-ml', toId: 'skill-statistics', strength: 0.7 },
  { fromId: 'skill-statistics', toId: 'skill-machine-learning', strength: 0.9 },
  { fromId: 'skill-linear-algebra', toId: 'skill-machine-learning', strength: 0.8 },
  { fromId: 'skill-python', toId: 'skill-machine-learning', strength: 0.85 },
  { fromId: 'skill-machine-learning', toId: 'skill-deep-learning', strength: 0.95 },
  { fromId: 'skill-deep-learning', toId: 'skill-llm-engineering', strength: 0.8 },
  { fromId: 'skill-prompt-engineering', toId: 'skill-llm-engineering', strength: 0.7 },
  { fromId: 'skill-vector-databases', toId: 'skill-llm-engineering', strength: 0.6 },
  { fromId: 'skill-machine-learning', toId: 'skill-mlops', strength: 0.8 },
  { fromId: 'skill-containerisation', toId: 'skill-mlops', strength: 0.6 },
  { fromId: 'skill-ci-cd', toId: 'skill-mlops', strength: 0.6 },
  { fromId: 'skill-linear-algebra', toId: 'skill-vector-databases', strength: 0.5 },

  { fromId: 'skill-javascript', toId: 'skill-typescript', strength: 0.9 },
  { fromId: 'skill-javascript', toId: 'skill-react', strength: 0.85 },
  { fromId: 'skill-html-css', toId: 'skill-react', strength: 0.7 },
  { fromId: 'skill-react', toId: 'skill-state-management', strength: 0.8 },
  { fromId: 'skill-javascript', toId: 'skill-nodejs', strength: 0.9 },
  { fromId: 'skill-nodejs', toId: 'skill-rest-api-design', strength: 0.6 },
  { fromId: 'skill-relational-databases', toId: 'skill-system-design', strength: 0.5 },
  { fromId: 'skill-sql', toId: 'skill-relational-databases', strength: 0.8 },

  { fromId: 'skill-sql', toId: 'skill-data-modelling', strength: 0.85 },
  { fromId: 'skill-data-modelling', toId: 'skill-data-warehousing', strength: 0.8 },
  { fromId: 'skill-sql', toId: 'skill-etl-pipelines', strength: 0.75 },
  { fromId: 'skill-python', toId: 'skill-etl-pipelines', strength: 0.7 },
  { fromId: 'skill-etl-pipelines', toId: 'skill-apache-spark', strength: 0.7 },
  { fromId: 'skill-statistics', toId: 'skill-data-visualisation', strength: 0.5 },

  { fromId: 'skill-containerisation', toId: 'skill-container-orchestration', strength: 0.9 },
  { fromId: 'skill-containerisation', toId: 'skill-cloud-infrastructure', strength: 0.5 },
  { fromId: 'skill-ci-cd', toId: 'skill-cloud-infrastructure', strength: 0.5 },
];

/** type: what kind of support. suitableFor: where in the journey it helps. */
export const TOOL_SUPPORTS = [
  { toolId: 'tool-jupyter', skillId: 'skill-statistics', type: 'notebook', suitableFor: 'learning' },
  { toolId: 'tool-jupyter', skillId: 'skill-machine-learning', type: 'notebook', suitableFor: 'prototyping' },
  { toolId: 'tool-jupyter', skillId: 'skill-data-visualisation', type: 'notebook', suitableFor: 'prototyping' },
  { toolId: 'tool-scikit-learn', skillId: 'skill-machine-learning', type: 'library', suitableFor: 'learning' },
  { toolId: 'tool-pytorch', skillId: 'skill-deep-learning', type: 'framework', suitableFor: 'production' },
  { toolId: 'tool-tensorflow', skillId: 'skill-deep-learning', type: 'framework', suitableFor: 'production' },
  { toolId: 'tool-hugging-face', skillId: 'skill-deep-learning', type: 'platform', suitableFor: 'prototyping' },
  { toolId: 'tool-hugging-face', skillId: 'skill-llm-engineering', type: 'platform', suitableFor: 'prototyping' },
  { toolId: 'tool-langchain', skillId: 'skill-llm-engineering', type: 'framework', suitableFor: 'production' },
  { toolId: 'tool-langchain', skillId: 'skill-prompt-engineering', type: 'framework', suitableFor: 'prototyping' },
  { toolId: 'tool-pinecone', skillId: 'skill-vector-databases', type: 'database', suitableFor: 'production' },
  { toolId: 'tool-numpy', skillId: 'skill-linear-algebra', type: 'library', suitableFor: 'learning' },
  { toolId: 'tool-numpy', skillId: 'skill-mathematics-for-ml', type: 'library', suitableFor: 'learning' },
  { toolId: 'tool-pandas', skillId: 'skill-statistics', type: 'library', suitableFor: 'prototyping' },
  { toolId: 'tool-pandas', skillId: 'skill-data-modelling', type: 'library', suitableFor: 'prototyping' },
  { toolId: 'tool-mlflow', skillId: 'skill-mlops', type: 'platform', suitableFor: 'production' },
  { toolId: 'tool-airflow', skillId: 'skill-etl-pipelines', type: 'platform', suitableFor: 'production' },
  { toolId: 'tool-dbt', skillId: 'skill-data-modelling', type: 'framework', suitableFor: 'production' },
  { toolId: 'tool-dbt', skillId: 'skill-data-warehousing', type: 'framework', suitableFor: 'production' },
  { toolId: 'tool-snowflake', skillId: 'skill-data-warehousing', type: 'platform', suitableFor: 'production' },
  { toolId: 'tool-tableau', skillId: 'skill-data-visualisation', type: 'platform', suitableFor: 'production' },
  { toolId: 'tool-tableau', skillId: 'skill-business-intelligence', type: 'platform', suitableFor: 'production' },
  { toolId: 'tool-postgresql', skillId: 'skill-sql', type: 'database', suitableFor: 'learning' },
  { toolId: 'tool-postgresql', skillId: 'skill-relational-databases', type: 'database', suitableFor: 'production' },
  { toolId: 'tool-docker', skillId: 'skill-containerisation', type: 'platform', suitableFor: 'learning' },
  { toolId: 'tool-kubernetes', skillId: 'skill-container-orchestration', type: 'platform', suitableFor: 'production' },
  { toolId: 'tool-github-actions', skillId: 'skill-ci-cd', type: 'platform', suitableFor: 'production' },
];

export const PERSONS = [
  {
    id: 'person-avery',
    name: 'Avery Shah',
    currentRoleId: 'role-senior-backend-engineer',
    targetRoleId: 'role-senior-ai-engineer',
    since: 2021,
    skills: [
      { skillId: 'skill-python', proficiency: 4 },
      { skillId: 'skill-sql', proficiency: 4 },
      { skillId: 'skill-typescript', proficiency: 4 },
      { skillId: 'skill-nodejs', proficiency: 4 },
      { skillId: 'skill-rest-api-design', proficiency: 5 },
      { skillId: 'skill-relational-databases', proficiency: 4 },
      { skillId: 'skill-system-design', proficiency: 4 },
      { skillId: 'skill-caching', proficiency: 3 },
      { skillId: 'skill-containerisation', proficiency: 3 },
      { skillId: 'skill-ci-cd', proficiency: 3 },
      { skillId: 'skill-linear-algebra', proficiency: 2 },
    ],
  },
  {
    id: 'person-jordan',
    name: 'Jordan Meyer',
    currentRoleId: 'role-frontend-engineer',
    targetRoleId: 'role-full-stack-engineer',
    since: 2022,
    skills: [
      { skillId: 'skill-javascript', proficiency: 4 },
      { skillId: 'skill-typescript', proficiency: 3 },
      { skillId: 'skill-html-css', proficiency: 5 },
      { skillId: 'skill-react', proficiency: 4 },
      { skillId: 'skill-state-management', proficiency: 3 },
      { skillId: 'skill-web-accessibility', proficiency: 3 },
      { skillId: 'skill-frontend-testing', proficiency: 3 },
    ],
  },
  {
    id: 'person-sam',
    name: 'Sam Okafor',
    currentRoleId: 'role-data-analyst',
    targetRoleId: 'role-data-engineer',
    since: 2023,
    skills: [
      { skillId: 'skill-sql', proficiency: 4 },
      { skillId: 'skill-python', proficiency: 2 },
      { skillId: 'skill-statistics', proficiency: 3 },
      { skillId: 'skill-data-visualisation', proficiency: 4 },
      { skillId: 'skill-business-intelligence', proficiency: 3 },
    ],
  },
];
