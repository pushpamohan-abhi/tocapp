import { HotQuestion, PblChallenge } from '../types';

export interface CurriculumSection {
  id: string;
  number: string;
  title: string;
  ullmanChapter: string;
  summary: string;
  lecturerMethods: string[];
  realWorldApps: string[];
  manifold: {
    algebraic: string;
    setBuilder: string;
    formalTuple: string;
    description: string;
  };
  keyConcepts: {
    term: string;
    definition: string;
    analogy: string;
  }[];
}

export interface CurriculumSection {
  id: string;
  number: string;
  title: string;
  ullmanChapter: string;
  summary: string;
  lecturerMethods: string[];
  realWorldApps: (string | { name: string; diagram?: { states: string[]; transitions: string[]; explanation: string } })[];
  manifold: {
    algebraic: string;
    setBuilder: string;
    formalTuple: string;
    description: string;
  };
  keyConcepts: {
    term: string;
    definition: string;
    analogy: string;
  }[];
  padmaReddyExamples?: {
    title: string;
    problem: string;
    stepByStepSolution: string[];
    finalAnswer: string;
  }[];
}

export const CURRICULUM_SECTIONS: CurriculumSection[] = [
  {
    id: '1.0',
    number: '1.0',
    title: 'Prerequisite Set Theory & Mathematical Foundations',
    ullmanChapter: 'Padma Reddy Chapter 1 • Set Theory, Relations, Functions, Proof Techniques',
    summary: 'Establishes essential mathematical prerequisites according to Dr. A.M. Padma Reddy textbook syllabus for VTU 4th Sem CSE (BCS503/18CS51). Covers Sets, Operations, Venn Diagrams, Power Sets, Binary Relations, Equivalence Relations, Functions, Principle of Mathematical Induction, Diagonalization, Alphabets, and Strings.',
    lecturerMethods: [
      'Board demonstration of Set Theory operations (Union, Intersection, Complement, Cartesian Product).',
      'Step-by-step induction proofs on blackboard (Basis step, Inductive hypothesis, Inductive step).',
      'Relation matrices and Directed Graph representations for Reflexive, Symmetric, and Transitive properties.'
    ],
    realWorldApps: [
      'Relational Database Schema Design (Set Theory & Cartesian Products)',
      'Type Checking Systems in Compilers (Functions & Set Inclusion)',
      'Algorithm Complexity Proofs (Mathematical Induction & Recursion)'
    ],
    manifold: {
      algebraic: 'A × B = {(a, b) | a ∈ A ∧ b ∈ B}, P(A) = {S | S ⊆ A}',
      setBuilder: '{x | x ∈ A ∨ x ∈ B}, |P(A)| = 2^{|A|}',
      formalTuple: 'Sets A, B, Power Set P(A), Binary Relation R ⊆ A × B',
      description: 'The foundational mathematical language of automata theory defining symbols, groupings, mappings, and inductive proofs.'
    },
    keyConcepts: [
      {
        term: 'Set & Power Set P(A)',
        definition: 'A set is an unordered collection of distinct elements. The Power Set P(A) is the set of all subsets of A, with cardinality |P(A)| = 2^n for |A| = n.',
        analogy: 'A set is a bag of unique items; the power set represents every possible combination of items you can pick from the bag (including picking none or all).'
      },
      {
        term: 'Equivalence Relation',
        definition: 'A binary relation R on set A that is simultaneously Reflexive (aRa), Symmetric (aRb ⇒ bRa), and Transitive (aRb ∧ bRc ⇒ aRc).',
        analogy: 'The relation "has the same age as" among students in a classroom.'
      },
      {
        term: 'Mathematical Induction',
        definition: 'A mathematical proof technique consisting of a Basis Step (n=1) and an Inductive Step (assume true for k, prove true for k+1).',
        analogy: 'A line of falling dominoes: pushing the first domino over (basis) guarantees the entire infinite line falls (induction).'
      },
      {
        term: 'Alphabet (Σ) & String (w)',
        definition: 'Alphabet Σ is a finite non-empty set of symbols. String w is a finite sequence of symbols from Σ with length |w|.',
        analogy: 'Alphabet = piano keys; String = a melody played by striking keys in sequence.'
      }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem 1: Mathematical Induction Proof',
        problem: 'Prove by the principle of mathematical induction that for all positive integers n ≥ 1:\n1 + 2 + 3 + ... + n = n(n + 1) / 2',
        stepByStepSolution: [
          'Step 1 (Basis Step): Let P(n) be the statement 1 + 2 + ... + n = n(n + 1) / 2. Test for n = 1:\nLHS = 1\nRHS = 1(1 + 1) / 2 = 2 / 2 = 1.\nSince LHS = RHS, P(1) is true.',
          'Step 2 (Inductive Hypothesis): Assume P(k) is true for some arbitrary positive integer k ≥ 1:\n1 + 2 + 3 + ... + k = k(k + 1) / 2   --- (Equation 1)',
          'Step 3 (Inductive Step): We must prove P(k + 1) is true, i.e., show:\n1 + 2 + ... + k + (k + 1) = (k + 1)(k + 2) / 2',
          'Step 4 (Algebraic Derivation):\nLHS = [1 + 2 + ... + k] + (k + 1)\nSubstitute Equation 1 from Inductive Hypothesis:\nLHS = [k(k + 1) / 2] + (k + 1)\nTake common factor (k + 1):\nLHS = (k + 1) * [ (k / 2) + 1 ] = (k + 1) * [ (k + 2) / 2 ]\nLHS = (k + 1)(k + 2) / 2 = RHS.'
        ],
        finalAnswer: 'P(k+1) is true whenever P(k) is true. By the Principle of Mathematical Induction, P(n) holds for all n ≥ 1.'
      },
      {
        title: 'Padma Reddy Solved Problem 2: Set Operations & Power Set Cardinality',
        problem: 'Given sets A = {1, 2, 3} and B = {2, 3, 4}:\n(i) Find A ∪ B, A ∩ B, A - B, B - A.\n(ii) Construct the Power Set P(A) and verify its cardinality.\n(iii) Compute the Cartesian Product A × B.',
        stepByStepSolution: [
          'Step 1 (Set Operations):\n• Union A ∪ B = {x | x ∈ A or x ∈ B} = {1, 2, 3, 4}\n• Intersection A ∩ B = {x | x ∈ A and x ∈ B} = {2, 3}\n• Set Difference A - B = {x ∈ A | x ∉ B} = {1}\n• Set Difference B - A = {x ∈ B | x ∉ A} = {4}',
          'Step 2 (Power Set Construction):\nFor A = {1, 2, 3}, |A| = 3.\nSubsets of size 0: ∅\nSubsets of size 1: {1}, {2}, {3}\nSubsets of size 2: {1, 2}, {1, 3}, {2, 3}\nSubsets of size 3: {1, 2, 3}\nP(A) = { ∅, {1}, {2}, {3}, {1, 2}, {1, 3}, {2, 3}, {1, 2, 3} }\nCardinality |P(A)| = 2^3 = 8 elements. Verified!',
          'Step 3 (Cartesian Product A × B):\nA × B = { (a, b) | a ∈ A and b ∈ B }\n= { (1,2), (1,3), (1,4), (2,2), (2,3), (2,4), (3,2), (3,3), (3,4) }\nTotal ordered pairs |A × B| = |A| × |B| = 3 × 3 = 9 pairs.'
        ],
        finalAnswer: 'A ∪ B = {1,2,3,4}, A ∩ B = {2,3}, |P(A)| = 8, |A × B| = 9.'
      },
      {
        title: 'Padma Reddy Solved Problem 3: Equivalence Relation Proof',
        problem: 'Let R be a binary relation on the set of integers ℤ defined by: a R b if and only if (a - b) is divisible by 3 (i.e. a ≡ b mod 3). Prove that R is an equivalence relation.',
        stepByStepSolution: [
          'Step 1 (Reflexive Property):\nFor any integer a ∈ ℤ, a - a = 0. Since 0 = 3 × 0, 0 is divisible by 3. Hence, a R a for all a ∈ ℤ. (Reflexive holds)',
          'Step 2 (Symmetric Property):\nAssume a R b, so (a - b) = 3k for some integer k.\nThen b - a = -(a - b) = -3k = 3(-k).\nSince -k is an integer, (b - a) is divisible by 3. Hence b R a. (Symmetric holds)',
          'Step 3 (Transitive Property):\nAssume a R b and b R c. Then (a - b) = 3k1 and (b - c) = 3k2 for integers k1, k2.\nAdd both equations:\n(a - b) + (b - c) = 3k1 + 3k2 ⇒ a - c = 3(k1 + k2).\nSince k1 + k2 is an integer, (a - c) is divisible by 3. Hence a R c. (Transitive holds)'
        ],
        finalAnswer: 'Since R is Reflexive, Symmetric, and Transitive, R is an Equivalence Relation partitioning ℤ into 3 equivalence classes: [0], [1], and [2].'
      }
    ]
  },
  {
    id: '1.1',
    number: '1.1',
    title: 'Introduction to Automata Theory',
    ullmanChapter: 'Chapter 1 - Section 1.1',
    summary: 'Introduces central concepts of automata theory, alphabets, strings, and languages, establishing the mathematical foundations of computation and formal systems.',
    lecturerMethods: [
      'Interactive Alphabet & String breakdown with student participation.',
      'Analogy of finite state machines to automatic sliding doors or elevator control systems.'
    ],
    realWorldApps: [
      {
        name: 'Vending machine coin counters and controller logic',
        diagram: {
          states: ['Idle', 'Collecting', 'Dispensing'],
          transitions: ['Idle -> Collecting (Coin Insert)', 'Collecting -> Dispensing (Target Reached)', 'Dispensing -> Idle (Dispense Complete)'],
          explanation: 'The machine tracks accumulated coin value in "Collecting" state. Once the target amount is met, it transitions to "Dispensing" to release the item, then returns to "Idle".'
        }
      },
      {
        name: 'Digital watch state logic',
        diagram: {
          states: ['Display Time', 'Set Hours', 'Set Minutes'],
          transitions: ['Display Time -> Set Hours (Mode Button)', 'Set Hours -> Set Minutes (Mode Button)', 'Set Minutes -> Display Time (Mode Button)'],
          explanation: 'The watch cycles through modes upon button presses. Each mode modifies a specific part of the displayed time, cycling back to the main display.'
        }
      },
      {
        name: 'Traffic light controllers',
        diagram: {
          states: ['Red', 'Green', 'Yellow'],
          transitions: ['Red -> Green (Timer Expired)', 'Green -> Yellow (Timer Expired)', 'Yellow -> Red (Timer Expired)'],
          explanation: 'A cyclic controller that transitions between states based on set timers to regulate traffic flow.'
        }
      }
    ],
    manifold: {
      algebraic: 'Σ* = ∪_{k≥0} Σ^k',
      setBuilder: '{w ∈ Σ* | length(w) ≥ 0}',
      formalTuple: 'Alphabet Σ, String w, Language L ⊆ Σ*',
      description: 'The formal study of abstract computing devices, alphabets, and languages.'
    },
    keyConcepts: [
      {
        term: 'Alphabet (Σ)',
        definition: 'A finite, non-empty set of symbols (e.g. {0, 1} or {a, b}).',
        analogy: 'The letters of an alphabet or musical notes available for composition.'
      },
      {
        term: 'Language (L)',
        definition: 'A subset of strings formed from an alphabet Σ.',
        analogy: 'A dictionary of valid words in a language.'
      }
    ]
  },
  {
    id: '1.5',
    number: '1.5',
    title: 'Deterministic Finite Automata (DFA)',
    ullmanChapter: 'Chapter 1 - Section 1.5',
    summary: 'Defines DFA formally as a 5-tuple (Q, Σ, δ, q0, F) and explores state diagrams, transition functions, and string acceptance.',
    lecturerMethods: [
      'Live board tracing of binary string acceptance step-by-step.',
      'Visualizing state machine transitions as a board game walk.'
    ],
    realWorldApps: [
      'Lexical analyzer scanner token recognition',
      'Text search filtering and substring detection'
    ],
    manifold: {
      algebraic: 'δ: Q × Σ → Q',
      setBuilder: 'L(A) = {w ∈ Σ* | δ̂(q0, w) ∈ F}',
      formalTuple: '5-Tuple: (Q, Σ, δ, q0, F)',
      description: 'A deterministic machine with a single unique next state for every state-symbol pair.'
    },
    keyConcepts: [
      {
        term: 'Transition Function (δ)',
        definition: 'A mapping taking a state and input symbol to a single next state.',
        analogy: 'A road sign at an intersection directing you down exactly one highway.'
      },
      {
        term: 'Accepting States (F)',
        definition: 'A subset of states where successful string processing halts with approval.',
        analogy: 'The finish line of a race.'
      }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem 1: DFA for Substring "101"',
        problem: 'Design a DFA M over Σ = {0, 1} that accepts all strings containing the substring "101". Provide state table, state diagram description, and trace string w = 11010.',
        stepByStepSolution: [
          'Step 1 (State Definitions):\n• q0: Initial state (seen no relevant prefix of "101").\n• q1: Saw "1" (waiting for "01").\n• q2: Saw "10" (waiting for "1").\n• q3: Saw "101" (Accepting trap state).',
          'Step 2 (Transition Table Construction):\nState  | Input 0 | Input 1\n-------+---------+--------\n-> q0  |   q0    |   q1   \n   q1  |   q2    |   q1   \n   q2  |   q0    |   q3*  \n * q3  |   q3    |   q3   ',
          'Step 3 (Trace on input w = 11010):\nδ̂(q0, 11010):\n• δ(q0, 1) = q1\n• δ(q1, 1) = q1\n• δ(q1, 0) = q2\n• δ(q2, 1) = q3 (Accepting state reached!)\n• δ(q3, 0) = q3'
        ],
        finalAnswer: 'DFA M = ({q0, q1, q2, q3}, {0, 1}, δ, q0, {q3}) accepts string w = 11010 since δ̂(q0, 11010) = q3 ∈ F.'
      },
      {
        title: 'Padma Reddy Solved Problem 2: DFA for Number of a\'s Multiple of 3',
        problem: 'Construct a DFA over Σ = {a, b} that accepts all strings where the number of a\'s is divisible by 3 (i.e. N_a(w) mod 3 = 0).',
        stepByStepSolution: [
          'Step 1 (State Definitions):\n• q0: N_a(w) ≡ 0 mod 3 (Start & Accept state).\n• q1: N_a(w) ≡ 1 mod 3.\n• q2: N_a(w) ≡ 2 mod 3.',
          'Step 2 (Transition Logic):\nInput \'a\' advances state cyclically: q0 → q1 → q2 → q0.\nInput \'b\' leaves state unchanged (loops on self).',
          'Step 3 (Transition Function δ):\n• δ(q0, a) = q1, δ(q0, b) = q0\n• δ(q1, a) = q2, δ(q1, b) = q1\n• δ(q2, a) = q0, δ(q2, b) = q2'
        ],
        finalAnswer: '5-tuple DFA M = ({q0, q1, q2}, {a, b}, δ, q0, {q0}) accepts strings like ε, bbb, aaa, baabaa.'
      }
    ]
  },
  {
    id: '2.2',
    number: '2.2',
    title: 'Nondeterministic Finite Automata (NFA)',
    ullmanChapter: 'Chapter 2 - Section 2.2',
    summary: 'Explores NFAs where a state and input can lead to zero, one, or multiple next states, enabling parallel guessing paths.',
    lecturerMethods: [
      'Parallel universe analogy for multiple active states simultaneously.',
      'Visualizing subset branching on ambiguous transitions.'
    ],
    realWorldApps: [
      'Regex matching engines and pattern search',
      'Approximate spelling and bioinformatics sequence alignment'
    ],
    manifold: {
      algebraic: 'δ: Q × Σ → ℘(Q)',
      setBuilder: 'L(N) = {w ∈ Σ* | ∃ path from q0 to F}',
      formalTuple: 'NFA Tuple: (Q, Σ, δ, q0, F) with powerset transitions',
      description: 'An automaton with non-deterministic transition branching into multiple states.'
    },
    keyConcepts: [
      {
        term: 'Powerset Transitions',
        definition: 'Transitions returning a set of possible next states rather than a single state.',
        analogy: 'Splitting into multiple investigators exploring different potential clues at once.'
      },
      {
        term: 'NFA Acceptance',
        definition: 'A string is accepted if at least one computation path leads to an accepting state.',
        analogy: 'Finding at least one winning lottery ticket among multiple purchased entries.'
      }
    ]
  },
  {
    id: '2.3',
    number: '2.3',
    title: 'Equivalence of NFA and DFA (Subset Construction)',
    ullmanChapter: 'Chapter 2 - Section 2.3',
    summary: 'Proves that DFAs and NFAs have equivalent expressive power using the subset construction algorithm to convert any NFA into a DFA.',
    lecturerMethods: [
      'Powerset building whiteboard exercise tracking subset states.',
      'Comparing NFA path explosion with DFA subset representation.'
    ],
    realWorldApps: [
      'Converting high-level NFA regex matchers into efficient DFA hardware lookup tables',
      'Compiler optimization pipelines'
    ],
    manifold: {
      algebraic: 'D_Q = ℘(Q_N)',
      setBuilder: '{ S ⊆ Q_N | S reachable via subset transitions }',
      formalTuple: 'Converted DFA: (℘(Q_N), Σ, δ_subset, {q0}, F_subset)',
      description: 'Mapping every NFA state subset into a single equivalent deterministic state.'
    },
    keyConcepts: [
      {
        term: 'Subset Construction',
        definition: 'Algorithm building DFA states as subsets of NFA states to simulate all parallel paths deterministically.',
        analogy: 'Summarizing all possible locations of a wandering group into a single bounding box.'
      },
      {
        term: 'Exponential Blowup',
        definition: 'An NFA with n states can yield a DFA with up to 2^n states in the worst case.',
        analogy: 'Combinatorial explosion of possibilities when tracking all subsets.'
      }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: NFA to DFA Subset Construction',
        problem: 'Convert the NFA N = ({q0, q1, q2}, {0, 1}, δ, q0, {q2}) into an equivalent DFA using Subset Construction, where δ(q0, 0) = {q0, q1}, δ(q0, 1) = {q0}, δ(q1, 0) = ∅, δ(q1, 1) = {q2}, δ(q2, 0) = {q2}, δ(q2, 1) = {q2}.',
        stepByStepSolution: [
          'Step 1 (Start State of DFA):\nLet initial DFA state A = {q0}.',
          'Step 2 (Compute transitions for A = {q0}):\n• δ_D(A, 0) = δ_N(q0, 0) = {q0, q1}. Call this new state B = {q0, q1}.\n• δ_D(A, 1) = δ_N(q0, 1) = {q0} = A.',
          'Step 3 (Compute transitions for B = {q0, q1}):\n• δ_D(B, 0) = δ_N(q0, 0) ∪ δ_N(q1, 0) = {q0, q1} ∪ ∅ = {q0, q1} = B.\n• δ_D(B, 1) = δ_N(q0, 1) ∪ δ_N(q1, 1) = {q0} ∪ {q2} = {q0, q2}. Call this new state C = {q0, q2}.',
          'Step 4 (Compute transitions for C = {q0, q2}):\n• δ_D(C, 0) = δ_N(q0, 0) ∪ δ_N(q2, 0) = {q0, q1} ∪ {q2} = {q0, q1, q2}. Call this new state D = {q0, q1, q2}.\n• δ_D(C, 1) = δ_N(q0, 1) ∪ δ_N(q2, 1) = {q0} ∪ {q2} = {q0, q2} = C.',
          'Step 5 (Compute transitions for D = {q0, q1, q2}):\n• δ_D(D, 0) = δ_N(q0, 0) ∪ δ_N(q1, 0) ∪ δ_N(q2, 0) = {q0, q1} ∪ ∅ ∪ {q2} = {q0, q1, q2} = D.\n• δ_D(D, 1) = δ_N(q0, 1) ∪ δ_N(q1, 1) ∪ δ_N(q2, 1) = {q0} ∪ {q2} ∪ {q2} = {q0, q2} = C.',
          'Step 6 (Identify Accept States):\nAccepting states are those containing q2: States C = {q0, q2} and D = {q0, q1, q2}.'
        ],
        finalAnswer: 'Equivalent DFA M_D has 4 states: A={q0}, B={q0,q1}, C={q0,q2}*, D={q0,q1,q2}* with accept states {C, D}.'
      }
    ]
  },
  {
    id: '2.4',
    number: '2.4',
    title: 'Transitions with Epsilon (ε-NFA)',
    ullmanChapter: 'Chapter 2 - Section 2.4',
    summary: 'Introduces ε-transitions allowing state changes without consuming input symbols, essential for Thompson construction.',
    lecturerMethods: [
      'Teleportation analogy for ε-moves without advancing the tape head.',
      'Calculating ε-closure step-by-step through connected states.'
    ],
    realWorldApps: [
      'Modular compiler regex concatenation and union builders',
      'State chart hierarchical sub-machine routing'
    ],
    manifold: {
      algebraic: 'ECL(q) = {p | q →*^ε p}',
      setBuilder: '{p ∈ Q | (q, ε) ⊢* (p, ε)}',
      formalTuple: 'ε-NFA Tuple: (Q, Σ ∪ {ε}, δ, q0, F)',
      description: 'Transitions triggered by empty string ε providing structural modularity.'
    },
    keyConcepts: [
      {
        term: 'ε-Closure',
        definition: 'The set of all states reachable from a given state using zero or more ε-transitions.',
        analogy: 'All rooms you can reach from your current room through doors that are unlocked and open.'
      },
      {
        term: 'Thompson Construction',
        definition: 'Using ε-transitions to glue smaller ε-NFAs together into larger union, concatenation, and star automata.',
        analogy: 'Building complex LEGO assemblies out of modular sub-blocks.'
      }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: ε-Closure Computation & ε-NFA to DFA',
        problem: 'For an ε-NFA with states {q0, q1, q2} and ε-transitions δ(q0, ε) = {q1}, δ(q1, ε) = {q2}, δ(q1, a) = {q1}, δ(q2, b) = {q2}, compute:\n(i) ε-closure(q0), ε-closure(q1), ε-closure(q2).\n(ii) The string w = "ab" processing.',
        stepByStepSolution: [
          'Step 1 (ε-Closure Computation):\n• ε-closure(q0) = {q0, q1, q2} (since q0 →ε q1 →ε q2).\n• ε-closure(q1) = {q1, q2}.\n• ε-closure(q2) = {q2}.',
          'Step 2 (Processing input symbol "a" from start state q0):\n• Start set S0 = ε-closure(q0) = {q0, q1, q2}.\n• δ(S0, a) = δ(q0,a) ∪ δ(q1,a) ∪ δ(q2,a) = ∅ ∪ {q1} ∪ ∅ = {q1}.\n• S1 = ε-closure({q1}) = {q1, q2}.',
          'Step 3 (Processing input symbol "b" from set S1):\n• δ(S1, b) = δ(q1,b) ∪ δ(q2,b) = ∅ ∪ {q2} = {q2}.\n• S2 = ε-closure({q2}) = {q2}.'
        ],
        finalAnswer: 'ε-closure(q0) = {q0, q1, q2}. Processing "ab" transitions from {q0, q1, q2} to {q1, q2} to final state {q2}.'
      }
    ]
  },
  {
    id: '2.5',
    number: '2.5',
    title: 'State Equivalence & DFA Minimization',
    ullmanChapter: 'Chapter 2 - Section 2.5',
    summary: 'The table-filling algorithm for discovering distinguishable state pairs and merging them into the unique minimal DFA.',
    lecturerMethods: [
      'Matrix grid game for marking distinguishable pairs.',
      'Myhill-Nerode equivalence theorem intuition.'
    ],
    realWorldApps: [
      'Compiler scanner table compression',
      'Sequential circuit gate minimization'
    ],
    manifold: {
      algebraic: 'p ≁ q ⇔ ∃w: δ̂(p,w) ∈ F ⊻ δ̂(q,w) ∈ F',
      setBuilder: '{ {p,q} ⊆ Q | p and q are distinguishable }',
      formalTuple: 'Minimal DFA: (Q/∼, Σ, δ/∼, [q0], F/∼)',
      description: 'Partitioning states into equivalence classes of indistinguishable behaviors.'
    },
    keyConcepts: [
      {
        term: 'Distinguishable Pairs',
        definition: 'Two states are distinguishable if some input string leads one to an accept state and the other to non-accept.',
        analogy: 'Two taste testers giving different verdicts on the same mystery dish.'
      },
      {
        term: 'Table-Filling Algorithm',
        definition: 'Iteratively marking matrix pairs (p, q) as distinguishable based on base outputs or transition outcomes.',
        analogy: 'Spreading dye in a grid starting from known color differences.'
      }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: DFA State Minimization (Table-Filling Algorithm)',
        problem: 'Minimize the DFA M with states {A, B, C, D, E, F}, start state A, accept state C, and transitions:\nδ(A,0)=B, δ(A,1)=C; δ(B,0)=A, δ(B,1)=D; δ(C,0)=E, δ(C,1)=F; δ(D,0)=E, δ(D,1)=F; δ(E,0)=E, δ(E,1)=F; δ(F,0)=F, δ(F,1)=F.',
        stepByStepSolution: [
          'Step 1 (Base Step - Mark Accept vs Non-Accept Pairs):\nMark all pairs {p, C} where p ≠ C as distinguishable (X): {A,C}, {B,C}, {D,C}, {E,C}, {F,C}.',
          'Step 2 (Induction Step - Test Transitions):\n• For pair {C, D}: C is accepting, D is non-accepting ⇒ Already marked.\n• For pair {C, E}: C is accepting, E is non-accepting ⇒ Already marked.\n• Compare pair {D, E}: δ(D,0)=E, δ(E,0)=E (same); δ(D,1)=F, δ(E,1)=F (same) ⇒ {D, E} are equivalent!\n• Compare pair {E, F}: δ(E,0)=E, δ(F,0)=F (pair {E,F}); δ(E,1)=F, δ(F,1)=F ⇒ {E, F} are equivalent!',
          'Step 3 (Merge Equivalence Classes):\nEquivalence classes formed: [A], [B], [C], [D = E = F].'
        ],
        finalAnswer: 'Minimized DFA has 4 merged states: {A}, {B}, {C}*, {D, E, F}. Redundant states E and F collapsed.'
      }
    ]
  },
  {
    id: '3.1',
    number: '3.1',
    title: 'Regular Expressions',
    ullmanChapter: 'Chapter 3 - Section 3.1',
    summary: 'Regular expressions (REs) provide a declarative algebraic way to describe languages using operators: union (+), concatenation (·), and Kleene closure (*).',
    lecturerMethods: [
      'Interactive Pattern Building: Students construct regex for specific phone/email formats before formal definitions.',
      'Analogy to Arithmetic: Show how union behaves like addition and concatenation like multiplication, with Kleene closure as iterative repetition.'
    ],
    realWorldApps: [
      'Text Editor Search & Replace (grep, VS Code regex finder)',
      'Data Validation in Forms (ZIP codes, email regex in JavaScript/Python)'
    ],
    manifold: {
      algebraic: 'R = (0 + 1)*1(0 + 1)*',
      setBuilder: '{w ∈ {0,1}* | w contains at least one 1}',
      formalTuple: 'Alphabet Σ = {0, 1}, Operations: Union (∪), Concatenation (.), Star (*)',
      description: 'A structural way of denoting languages over alphabet Σ using atomic symbols, ε, ∅, and three fundamental recursive operators.'
    },
    keyConcepts: [
      {
        term: 'Base Cases',
        definition: 'Symbols in alphabet Σ, ε (empty string), and ∅ (empty set) are regular expressions denoting {a}, {ε}, and ∅ respectively.',
        analogy: 'The primary building blocks or atoms in chemistry.'
      },
      {
        term: 'Kleene Closure (*)',
        definition: 'Represents zero or more concatenations of a regular expression R (R* = ε ∪ R ∪ RR ∪ RRR...).',
        analogy: 'A loop that can execute zero times or repeatedly without upper limit.'
      },
      {
        term: 'Precedence Rules',
        definition: 'Kleene star (*) has highest precedence, followed by concatenation (·), followed by union (+). Parentheses override precedence.',
        analogy: 'Order of operations in arithmetic (PEMDAS: exponents/stars first, then concat/multiply, then union/add).'
      }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: Regular Expressions for Language Descriptions',
        problem: 'Write Regular Expressions over Σ = {0, 1} for:\n(i) Language of all strings starting with 01 and ending with 10.\n(ii) Language of all strings containing an even number of 0s.\n(iii) Language of all strings not containing consecutive 1s.',
        stepByStepSolution: [
          'Step 1 (Part i - Starts with 01 & Ends with 10):\n• Prefix must be "01", suffix must be "10", middle can be any arbitrary string (0+1)*.\n• RegEx R = 01(0+1)*10.',
          'Step 2 (Part ii - Even number of 0s):\n• Any number of 1s can appear anywhere. A pair of 0s separated by 1s is denoted by (1* 0 1* 0 1*).\n• Repeating this pair zero or more times yields: R = 1*(0 1* 0 1*)*.',
          'Step 3 (Part iii - No consecutive 1s):\n• Blocks of zeros separated by at most single 1s: (0 + 10)*(ε + 1) or (1+ε)(0+01)*.'
        ],
        finalAnswer: '(i) 01(0+1)*10; (ii) 1*(0 1* 0 1*)*; (iii) (0 + 10)*(ε + 1).'
      }
    ]
  },
  {
    id: '3.2',
    number: '3.2',
    title: 'Finite Automata and Regular Expressions',
    ullmanChapter: 'Chapter 3 - Section 3.2 (Except 3.2.1)',
    summary: 'Explores how to convert between finite automata (DFA/NFA) and regular expressions using state elimination (McNaughton-Yamada-Thompson method) and GNFA transitions.',
    lecturerMethods: [
      'Animated State Elimination: Visualize peeling away intermediate states like unzipping a jacket while preserving path regular expressions.',
      'Group Peer Check: Students swap NFA sketches and convert them to RegEx using alternative elimination orders.'
    ],
    realWorldApps: [
      'Compiler Lexical Analyzers: Translating token definitions into NFA/DFA scanner tables.',
      'Network Protocol State Transition Verification.'
    ],
    manifold: {
      algebraic: 'GNFA with generalized regular expression edge labels R_ij',
      setBuilder: 'L(A) = L(R) where A is DFA and R is RegEx',
      formalTuple: 'GNFA Tuple: (Q, Σ, δ, q_start, q_accept) with regular expression transitions',
      description: 'Equivalence between finite automata and regular expressions: every regular language has a DFA and vice versa.'
    },
    keyConcepts: [
      {
        term: 'State Elimination (GNFA)',
        definition: 'Converting a DFA/NFA into a Generalized Nondeterministic Finite Automaton with 1 start and 1 accept state, then successively removing states while updating edge expressions.',
        analogy: 'Simplifying electrical circuit resistance networks by combining series and parallel paths.'
      },
      {
        term: 'Subset Construction & Closure',
        definition: 'Bridging regex to automata via Thompson construction (building NFAs for union, concat, star) and converting NFA to DFA.',
        analogy: 'Translating high-level declarative code (SQL/RegEx) down to low-level state machine hardware instructions.'
      }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: DFA to Regular Expression Conversion (Arden\'s Theorem / State Elimination)',
        problem: 'Convert DFA with 2 states q1 (start) and q2 (accept) to RegEx, where δ(q1, a) = q1, δ(q1, b) = q2, δ(q2, a) = q2, δ(q2, b) = q1.',
        stepByStepSolution: [
          'Step 1 (Formulate State Equations):\nq1 = q1 a + q2 b + ε   --- (Eq 1)\nq2 = q1 b + q2 a       --- (Eq 2)',
          'Step 2 (Apply Arden\'s Theorem R = Q + RP ⇒ R = QP* to Eq 2):\nq2 = (q1 b) a*   --- (Eq 3)',
          'Step 3 (Substitute Eq 3 into Eq 1):\nq1 = q1 a + (q1 b a*) b + ε\nq1 = q1 (a + b a* b) + ε',
          'Step 4 (Apply Arden\'s Theorem to q1):\nq1 = ε (a + b a* b)* = (a + b a* b)*',
          'Step 5 (Substitute q1 into Eq 3 for accept state q2):\nq2 = (a + b a* b)* b a*'
        ],
        finalAnswer: 'Regular Expression R = (a + b a* b)* b a*.'
      }
    ]
  },
  {
    id: '3.3',
    number: '3.3',
    title: 'Applications of Regular Expressions',
    ullmanChapter: 'Chapter 3 - Section 3.3',
    summary: 'Practical applications including lexical analysis in compilers, finding patterns in large corpora of text (grep), and XML/JSON schema validation.',
    lecturerMethods: [
      'Problem-Based Learning: Build a working lexer tokenizing keywords, identifiers, and operators for a mini programming language.',
      'Real-World Corpus Search: Running regular expression pattern matching on actual source code files.'
    ],
    realWorldApps: [
      'Lexical Analyzers (Lex/Flex tools in C/C++)',
      'Web Scraping & Log Analysis (Extracting IP addresses, timestamps, URLs)'
    ],
    manifold: {
      algebraic: 'Lexer Rules: ID = [a-zA-Z][a-zA-Z0-9]*, NUM = [0-9]+',
      setBuilder: 'Pattern Matches P ⊂ Corpus C',
      formalTuple: 'Transducer / DFA with output actions per accepting token state',
      description: 'Translating abstract string matching theory into high-performance industrial search and compiler scanning engines.'
    },
    keyConcepts: [
      {
        term: 'Token Recognition',
        definition: 'Partitioning a raw source code character stream into meaningful tokens (identifiers, numbers, keywords) using maximal munch rule.',
        analogy: 'Reading a sentence and instantly recognizing words, punctuation, and numbers rather than random characters.'
      },
      {
        term: 'Maximal Munch',
        definition: 'Lexer rule preferring the longest possible matching prefix when multiple regex patterns match the input stream.',
        analogy: 'Reading "while1" as identifier "while1" rather than keyword "while" followed by number "1".'
      }
    ]
  },
  {
    id: '4.1',
    number: '4.1',
    title: 'Proving Languages are not Regular',
    ullmanChapter: 'Chapter 4 - Section 4.1',
    summary: 'The Pumping Lemma for regular languages provides a necessary (though not sufficient) condition that all regular languages must satisfy, used to prove non-regularity.',
    lecturerMethods: [
      'The Adversarial Game Analogy: Pumping lemma as a 3-turn game between Prover (you) and Adversary (the pigeonhole principle).',
      'Visual String Splitting: Visualizing string w split into xyz where |xy| ≤ n and y can be pumped i times.'
    ],
    realWorldApps: [
      'Proving limitations of finite memory systems (showing finite automata cannot count arbitrarily high or match nested parentheses like HTML/JSON blocks).',
      'Cryptography & Protocol security bounds.'
    ],
    manifold: {
      algebraic: '∀ L regular, ∃ n, ∀ w ∈ L with |w| ≥ n, ∃ x, y, z such that w = xyz, |xy| ≤ n, |y| ≥ 1, and ∀ i ≥ 0, xy^i z ∈ L',
      setBuilder: 'Non-Regular L = {a^n b^n | n ≥ 0}',
      formalTuple: 'Pumping length n (Pigeonhole principle bound)',
      description: 'A mathematical proof technique exploiting the finite state pigeonhole principle of DFAs to demonstrate certain languages require infinite memory.'
    },
    keyConcepts: [
      {
        term: 'Pumping Length (n)',
        definition: 'The number of states in a DFA accepting language L. Any string of length n or greater must visit at least one state twice.',
        analogy: 'A circular racetrack with n stations. If you walk n+1 stations, you are guaranteed to visit some checkpoint twice.'
      },
      {
        term: 'The Adversary Game',
        definition: 'Demonstrating that no matter what string w and split xyz the adversary picks, you can choose a pumping factor i (e.g. i=0 or i=2) that forces the pumped string out of language L.',
        analogy: 'A courtroom debate where you trap your opponent in an impossible mathematical contradiction.'
      }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: Non-Regularity Proof using Pumping Lemma',
        problem: 'Prove using Pumping Lemma that the language L = {a^n b^n | n ≥ 0} is not regular.',
        stepByStepSolution: [
          'Step 1 (Assumption for Contradiction):\nAssume L is regular. Then there exists a pumping length p.',
          'Step 2 (Choose String w ∈ L with |w| ≥ p):\nChoose w = a^p b^p. Clearly w ∈ L and |w| = 2p ≥ p.',
          'Step 3 (Apply Pumping Lemma Decomposition w = xyz):\nBy Pumping Lemma, |xy| ≤ p and |y| ≥ 1. Therefore, y must consist entirely of a\'s (say y = a^k where 1 ≤ k ≤ p).',
          'Step 4 (Pump string with i = 2):\nConsider w\' = xy^2 z = x y y z = a^(p+k) b^p.\nSince k ≥ 1, the number of a\'s is p+k, which is strictly greater than the number of b\'s (p).',
          'Step 5 (Contradiction):\nw\' = a^(p+k) b^p ∉ L, violating the Pumping Lemma condition xy^i z ∈ L for all i ≥ 0.'
        ],
        finalAnswer: 'Contradiction reached! L = {a^n b^n | n ≥ 0} is not a regular language.'
      }
    ]
  },
  {
    id: '4.2',
    number: '4.2',
    title: 'Closure Properties of Regular Languages',
    ullmanChapter: 'Chapter 4 - Section 4.2',
    summary: 'Regular languages are closed under a wide variety of operations: union, intersection, complementation, difference, reversal, concatenation, star, homomorphism, and inverse homomorphism.',
    lecturerMethods: [
      'Machine Construction Demos: Showing how product construction builds intersection DFAs and complementation flips final states.',
      'Visual Venn Diagrams: Mapping language operations to geometric set operations.'
    ],
    realWorldApps: [
      'Query optimization in databases and firewall rule combination.',
      'String manipulation pipelines in text processing.'
    ],
    manifold: {
      algebraic: 'L1 ∪ L2, L1 ∩ L2, L̄, L1 · L2, L*',
      setBuilder: '{w | w ∈ L1 AND w ∈ L2} (Intersection via Product DFA)',
      formalTuple: 'Product Automaton Q × Q\' with transition δ((p,q), a) = (δ(p,a), δ\'(q,a))',
      description: 'Mathematical guarantees that combining regular languages through set operators yields another regular language.'
    },
    keyConcepts: [
      {
        term: 'Product Construction',
        definition: 'A method for proving closure under intersection (and union) by running two DFAs simultaneously in parallel as a cross-product state machine.',
        analogy: 'Two security guards walking the same corridor simultaneously, both needing to agree on checkpoints.'
      },
      {
        term: 'Complementation',
        definition: 'Swapping accepting and non-accepting states in a complete DFA to recognize the exact complement language L̄.',
        analogy: 'Reversing a door lock: unlocking becomes locking and vice versa.'
      }
    ]
  },
  {
    id: '4.4',
    number: '4.4',
    title: 'Equivalence and Minimization of Automata',
    ullmanChapter: 'Chapter 4 - Section 4.4',
    summary: 'Finding the unique minimum-state DFA for any regular language using the table-filling algorithm (distinguishable state pairs).',
    lecturerMethods: [
      'Table-Filling Grid Game: Step-by-step marking of state pairs (p, q) as distinguishable if one is accepting and the other is not, or if transitions lead to already distinguished pairs.',
      'Visual State Merging: Collapsing equivalent states into a single canonical representative.'
    ],
    realWorldApps: [
      'Compiler optimization of scanner state tables to reduce memory footprint.',
      'Hardware circuit minimization for sequential logic controllers.'
    ],
    manifold: {
      algebraic: 'Distinguishable relation p ~ q, Minimization M/R',
      setBuilder: '{ {p,q} ⊆ Q | ∃ w ∈ Σ*, δ̂(p,w) ∈ F ⊻ δ̂(q,w) ∈ F }',
      formalTuple: 'Myhill-Nerode Equivalence Classes over strings or states',
      description: 'An efficient O(n^2) algorithmic procedure to discover and merge redundant equivalent states in any DFA.'
    },
    keyConcepts: [
      {
        term: 'Distinguishable States',
        definition: 'Two states p and q are distinguishable if there exists some input string w that takes one to an accept state and the other to a non-accept state.',
        analogy: 'Two wine tasters who give different verdicts when given the same mystery bottle.'
      },
      {
        term: 'Table-Filling Algorithm',
        definition: 'An incremental matrix filling algorithm: base step marks (accept, non-accept) pairs; induction step marks pairs whose transitions under symbol a lead to already marked pairs.',
        analogy: 'Spreading stain in a fabric starting from known holes.'
      }
    ]
  },
  {
    id: '5.1',
    number: '5.1',
    title: 'Context-Free Grammars (CFG)',
    ullmanChapter: 'Chapter 5 - Section 5.1',
    summary: 'Context-free grammars describe languages using recursive substitution rules (productions), consisting of terminals, non-terminals, and a start symbol.',
    lecturerMethods: ['Grammar derivation trees whiteboard walkthrough.', 'Analogy to recursive sentence generation in natural languages.'],
    realWorldApps: ['Programming language syntax specifications (BNF/EBNF in compilers)', 'XML and JSON nested structure parsing'],
    manifold: {
      algebraic: 'G = (V, T, P, S)',
      setBuilder: 'L(G) = {w ∈ T* | S ⇒* w}',
      formalTuple: '4-Tuple Grammar: Non-terminals V, Terminals T, Productions P, Start S',
      description: 'A formal generative system capable of describing nested and hierarchical structures beyond regular languages.'
    },
    keyConcepts: [
      { term: 'Derivation Trees', definition: 'Hierarchical tree representation showing how terminals are derived from the start symbol.', analogy: 'A family tree showing ancestry of words.' },
      { term: 'Ambiguity', definition: 'A grammar is ambiguous if some string has more than one parse tree.', analogy: 'A sentence with multiple valid interpretations.' }
    ]
  },
  {
    id: '5.2',
    number: '5.2',
    title: 'Parse Trees & Ambiguity',
    ullmanChapter: 'Chapter 5 - Section 5.2',
    summary: 'Explores syntax trees, leftmost/rightmost derivations, and eliminating ambiguity in arithmetic expression grammars.',
    lecturerMethods: ['Dangling else ambiguity resolution exercise.', 'Operator precedence grammar layering.'],
    realWorldApps: ['Compiler expression evaluators', 'Calculator parsing engines'],
    manifold: {
      algebraic: 'E → E + T | T',
      setBuilder: '{ parseTrees(w) | |parseTrees(w)| > 1 }',
      formalTuple: 'Derivation sequence leftmost vs rightmost',
      description: 'Analyzing parse tree structures and resolving structural ambiguity.'
    },
    keyConcepts: [
      { term: 'Leftmost Derivation', definition: 'Always replacing the leftmost non-terminal at each step.', analogy: 'Reading and expanding text strictly from left to right.' },
      { term: 'Inherent Ambiguity', definition: 'A CFL is inherently ambiguous if every CFG for it is ambiguous.', analogy: 'A riddle with no single unambiguous solution.' }
    ]
  },
  {
    id: '5.4',
    number: '5.4',
    title: 'Normal Forms for CFGs',
    ullmanChapter: 'Chapter 5 - Section 5.4',
    summary: 'Chomsky Normal Form (CNF) and Greibach Normal Form constrain production rules to simplify parsing algorithms and proofs.',
    lecturerMethods: ['Eliminating ε-productions, unit productions, and useless symbols step-by-step.', 'CNF conversion pipeline.'],
    realWorldApps: ['CYK parsing algorithm for context-free membership testing', 'Natural language parsing algorithms'],
    manifold: {
      algebraic: 'A → BC or A → a',
      setBuilder: '{ G | all productions are A → BC or A → a }',
      formalTuple: 'CNF Grammars with binary non-terminal or single terminal RHS',
      description: 'Standardizing grammar rules into binary branching trees.'
    },
    keyConcepts: [
      { term: 'Chomsky Normal Form (CNF)', definition: 'All production rules are of the form A → BC or A → a.', analogy: 'Standardized building blocks where every module has either two children or one leaf.' }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: Conversion of CFG to Chomsky Normal Form (CNF)',
        problem: 'Convert the following grammar G to CNF:\nS → aA | bB\nA → aA | a\nB → bB | b',
        stepByStepSolution: [
          'Step 1 (Check ε-productions and Unit productions):\nGrammar has no ε-productions and no unit productions (like A → B).',
          'Step 2 (Replace terminals in long RHS rules with new non-terminals):\nIntroduce X_a → a and X_b → b.\nS → X_a A | X_b B\nA → X_a A | a\nB → X_b B | b',
          'Step 3 (Verify CNF production constraints):\nAll rules are now of form A → BC or A → a:\n• S → X_a A (binary non-terminals)\n• S → X_b B (binary non-terminals)\n• A → X_a A (binary non-terminals)\n• A → a (single terminal)\n• B → X_b B (binary non-terminals)\n• B → b (single terminal)\n• X_a → a, X_b → b (single terminals).'
        ],
        finalAnswer: 'CNF Rules: { S → X_a A | X_b B, A → X_a A | a, B → X_b B | b, X_a → a, X_b → b }.'
      }
    ]
  },
  {
    id: '6.1',
    number: '6.1',
    title: 'Pushdown Automata (PDA)',
    ullmanChapter: 'Chapter 6 - Section 6.1',
    summary: 'Pushdown automata extend finite automata with an unbounded LIFO stack, enabling recognition of context-free languages.',
    lecturerMethods: ['Stack push/pop visual trace simulation.', 'Matching parentheses with a physical stack box.'],
    realWorldApps: ['Compiler syntax checkers matching braces { } and parentheses ( )', 'XML tag balancing validation'],
    manifold: {
      algebraic: 'δ(q, a, X) = {(p, γ)}',
      setBuilder: 'L(PDA) = {w | (q0, w, Z0) ⊢* (p, ε, ε)}',
      formalTuple: '7-Tuple PDA: (Q, Σ, Γ, δ, q0, Z0, F)',
      description: 'A finite state machine augmented with a pushdown stack memory.'
    },
    keyConcepts: [
      { term: 'Stack Memory', definition: 'Last-in, first-out (LIFO) storage structure inspected and modified during transitions.', analogy: 'A spring-loaded stack of cafeteria trays.' }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: Design PDA for Language L = {a^n b^n | n ≥ 1}',
        problem: 'Construct a Pushdown Automaton P = (Q, Σ, Γ, δ, q0, Z0, F) that accepts L = {a^n b^n | n ≥ 1} by final state.',
        stepByStepSolution: [
          'Step 1 (7-Tuple Components):\nQ = {q0, q1, q2}, Σ = {a, b}, Γ = {a, Z0}, Start = q0, Start Stack = Z0, F = {q2}.',
          'Step 2 (Transition Logic):\n• In q0: Read \'a\', push \'a\' onto stack.\n  δ(q0, a, Z0) = {(q0, aZ0)}\n  δ(q0, a, a) = {(q0, aa)}\n• Read first \'b\': transition to q1, pop matching \'a\'.\n  δ(q0, b, a) = {(q1, ε)}\n• In q1: Continue reading \'b\', pop matching \'a\'.\n  δ(q1, b, a) = {(q1, ε)}\n• Stack bottom Z0 reached on empty input ε: transition to accept state q2.\n  δ(q1, ε, Z0) = {(q2, Z0)}',
          'Step 3 (Trace on input w = aabb):\n(q0, aabb, Z0) ⊢ (q0, abb, aZ0) ⊢ (q0, bb, aaZ0) ⊢ (q1, b, aZ0) ⊢ (q1, ε, Z0) ⊢ (q2, ε, Z0) [Accepted!]'
        ],
        finalAnswer: 'PDA P accepts L = {a^n b^n | n ≥ 1} by final state q2.'
      }
    ]
  },
  {
    id: '6.2',
    number: '6.2',
    title: 'PDA Acceptance Modes',
    ullmanChapter: 'Chapter 6 - Section 6.2',
    summary: 'Equivalence between acceptance by final state and acceptance by empty stack.',
    lecturerMethods: ['Converting empty stack PDA to final state PDA.', 'Stack clearing protocol.'],
    realWorldApps: ['Subroutine call stack tracking in runtime environments'],
    manifold: {
      algebraic: 'N(P) vs L(P)',
      setBuilder: '{w | stack becomes empty} ≡ {w | reaches accept state}',
      formalTuple: 'Equivalence theorem between N(P) and L(P)',
      description: 'Two equivalent paradigms for defining pushdown automata language recognition.'
    },
    keyConcepts: [
      { term: 'Empty Stack Acceptance', definition: 'Accepting when the stack is completely emptied after consuming the input.', analogy: 'Finishing a checklist and throwing away the clipboard.' }
    ]
  },
  {
    id: '6.3.1',
    number: '6.3.1',
    title: 'Equivalence of PDA and CFG',
    ullmanChapter: 'Chapter 6 - Section 6.3.1',
    summary: 'Proving that context-free grammars and pushdown automata define the exact same class of languages (Context-Free Languages).',
    lecturerMethods: ['Grammar production simulation on PDA stack.', 'Top-down parsing automaton construction.'],
    realWorldApps: ['Parser generators (Yacc, Bison, ANTLR) translating BNF grammars into stack-based automata parsers'],
    manifold: {
      algebraic: 'CFG ⇔ PDA',
      setBuilder: '{L | L is generated by CFG} = {L | L is accepted by PDA}',
      formalTuple: 'Biarched equivalence mapping between production rules and stack transitions',
      description: 'Mathematical proof that stack automata and recursive grammars have identical expressive power.'
    },
    keyConcepts: [
      { term: 'Top-Down Parsing PDA', definition: 'Simulating leftmost derivations on the PDA stack.', analogy: 'Unfolding a blueprint from top to bottom.' }
    ]
  },
  {
    id: '6.4',
    number: '6.4',
    title: 'Deterministic Pushdown Automata (DPDA)',
    ullmanChapter: 'Chapter 6 - Section 6.4',
    summary: 'Deterministic PDAs recognize deterministic context-free languages (DCFLs), which are parsed efficiently in linear time without backtracking.',
    lecturerMethods: ['Comparing ambiguous grammar parsing with deterministic LR parsing.', 'Uniqueness of transitions.'],
    realWorldApps: ['Programming language parsers (C, Java, Python parsers are designed as DCFLs)', 'Compiler syntax analysis'],
    manifold: {
      algebraic: 'DPDA ⊂ PDA',
      setBuilder: '{L | L accepted by deterministic PDA}',
      formalTuple: 'Single choice transition function without ε-conflict',
      description: 'Restricted pushdown automata with deterministic branching for efficient parsing.'
    },
    keyConcepts: [
      { term: 'Deterministic CFLs', definition: 'Languages accepted by DPDA, parsable in O(n) time.', analogy: 'A single-track train route with no ambiguous junctions.' }
    ]
  },
  {
    id: '7.1',
    number: '7.1',
    title: 'Turing Machines (TM)',
    ullmanChapter: 'Chapter 7 - Section 7.1',
    summary: 'The Turing machine model of computation, consisting of a finite control, an infinite read/write tape head, and state transition rules.',
    lecturerMethods: ['Tape head movement simulation on whiteboard.', 'Universal machine intuition.'],
    realWorldApps: ['Universal Turing machine as theoretical foundation of modern stored-program computers (Von Neumann architecture)', 'Algorithm complexity foundations'],
    manifold: {
      algebraic: 'δ: Q × Γ → Q × Γ × {L, R}',
      setBuilder: 'L(M) = {w ∈ Σ* | q0 w ⊢* α p β, p ∈ F}',
      formalTuple: '7-Tuple TM: (Q, Σ, Γ, δ, q0, b, F)',
      description: 'The standard abstract model of general-purpose mechanical computation.'
    },
    keyConcepts: [
      { term: 'Infinite Tape', definition: 'An unbounded linear tape storing symbols read and written by the tape head.', analogy: 'An endless ticker tape of paper.' },
      { term: 'Head Movements', definition: 'Head moves left (L) or right (R) per transition step.', analogy: 'A typewriter carriage moving back and forth.' }
    ],
    padmaReddyExamples: [
      {
        title: 'Padma Reddy Solved Problem: Design Turing Machine for Language L = {0^n 1^n | n ≥ 1}',
        problem: 'Construct a Turing Machine M = (Q, Σ, Γ, δ, q0, B, F) that accepts language L = {0^n 1^n | n ≥ 1}.',
        stepByStepSolution: [
          'Step 1 (Strategy):\n1. Read first 0, mark it as X, move Right searching for matching 1.\n2. Skip intermediate 0s and Ys until first un-marked 1 is found.\n3. Mark 1 as Y, move Left back to first un-marked 0.\n4. Repeat cycle until all 0s are marked as X.\n5. Verify no remaining 1s exist on tape, then enter Accept state q4.',
          'Step 2 (Transition Rules δ):\n• δ(q0, 0) = (q1, X, R)   --- Mark 0 as X, move Right\n• δ(q1, 0) = (q1, 0, R), δ(q1, Y) = (q1, Y, R)   --- Skip 0s and Ys\n• δ(q1, 1) = (q2, Y, L)   --- Mark matching 1 as Y, move Left\n• δ(q2, 0) = (q2, 0, L), δ(q2, Y) = (q2, Y, L)   --- Rewind Left\n• δ(q2, X) = (q0, X, R)   --- Found X, resume q0 scan\n• δ(q0, Y) = (q3, Y, R), δ(q3, Y) = (q3, Y, R)   --- Check all 0s marked\n• δ(q3, B) = (q4, B, R)   --- Blank reached ⇒ Accept state q4!',
          'Step 3 (Tape Instantaneous Description ID for w = 0011):\nq0 0011B ⊢ X q1 011B ⊢ X0 q1 11B ⊢ X q2 0Y1B ⊢ q2 X0Y1B ⊢ X q0 0Y1B ⊢ XX q1 Y1B ⊢ XXY q1 1B ⊢ XX q2 YYB ⊢ X q2 XYYB ⊢ XX q0 YYB ⊢ XXY q3 YB ⊢ XXYY q3 B ⊢ XXYYB q4 [Accept!]'
        ],
        finalAnswer: 'Turing Machine M = ({q0..q4}, {0,1}, {0,1,X,Y,B}, δ, q0, B, {q4}) accepts {0^n 1^n | n ≥ 1}.'
      }
    ]
  },
  {
    id: '7.2',
    number: '7.2',
    title: 'Programming Techniques for Turing Machines',
    ullmanChapter: 'Chapter 7 - Section 7.2',
    summary: 'Designing Turing machines for string reversal, palindrome recognition, integer addition, and multiplication.',
    lecturerMethods: ['Storage in state control vs storage on tape.', 'Multiple tracks and multi-tape Turing machines.'],
    realWorldApps: ['Low-level assembly programming and CPU register state management', 'Memory pointer manipulation'],
    manifold: {
      algebraic: 'Multi-tape TM ≡ Single-tape TM',
      setBuilder: '{ TM algorithms for arithmetic and pattern matching }',
      formalTuple: 'Subroutine composition and head marker techniques',
      description: 'Constructive programming paradigms using tape symbols and state memory.'
    },
    keyConcepts: [
      { term: 'Multiple Tracks', definition: 'Dividing tape cells into sub-tracks to store multiple values simultaneously.', analogy: 'Multi-lane highway sharing the same roadbed.' }
    ]
  },
  {
    id: '7.3',
    number: '7.3',
    title: 'Extensions of the Turing Machine',
    ullmanChapter: 'Chapter 7 - Section 7.3',
    summary: 'Equivalence of multi-tape TMs, non-deterministic TMs (NDTM), and single-tape standard TMs, proving the robustness of the Church-Turing thesis.',
    lecturerMethods: ['Interleaving tracks simulation for multi-tape TMs.', 'Parallel search tree simulation for NDTM.'],
    realWorldApps: ['Parallel computing models and multi-core processors', 'Theoretical complexity classes P vs NP'],
    manifold: {
      algebraic: 'TM_single ≡ TM_multi ≡ NDTM',
      setBuilder: '{L | accepted by NDTM} = {L | accepted by TM}',
      formalTuple: 'Robustness equivalence theorems',
      description: 'Proving that adding power (multiple tapes, non-determinism) does not increase computable language class.'
    },
    keyConcepts: [
      { term: 'Church-Turing Thesis', definition: 'Any intuitively computable function can be computed by a Turing machine.', analogy: 'The universal law governing mechanical computation.' }
    ]
  }
];

export const HOT_QUESTIONS: HotQuestion[] = [
  {
    id: 'hot-1',
    section: '3.1',
    title: 'The Ambiguity of Regular Expressions',
    prompt: 'Consider the regular expression (a + a*)*. Can this be simplified without changing the language denoted? Explain how algebraic laws of regular expressions (Section 3.2.1 analogy) allow us to simplify nested Kleene closures, and give a rigorous argument for why (a*)* = a*.',
    difficulty: 'Advanced',
    hints: [
      'Recall what a* means: zero or more a\'s.',
      'What does applying Kleene star multiple times (a*)* mean? Can zero or more repetitions of zero or more a\'s produce any string not already in a*?'
    ],
    sampleSolution: 'Yes, (a*)* simplifies to a*. By definition, a* denotes all strings of a\'s (including ε). Taking the star of a set that already contains ε and all powers of a yields no new strings because any concatenation of strings of a\'s is still just a string of a\'s. Thus, (a*)* = a*.'
  },
  {
    id: 'hot-2',
    section: '4.1',
    title: 'Pumping Lemma Adversary Strategy for Palindromes',
    prompt: 'Let L = {w ∈ {0, 1}* | w = w^R} (all binary palindromes). Use the Pumping Lemma to prove L is not regular. Specifically, what string w should you choose as a function of pumping length n, and how does the adversary\'s choice of xyz constrain your pumping choices?',
    difficulty: 'Expert',
    hints: [
      'Choose w = 0^n 1 0^n. Is |w| ≥ n?',
      'Since |xy| ≤ n, where must x and y lie within w? What happens when you pump y (e.g. i=0 or i=2)?'
    ],
    sampleSolution: 'Choose w = 0^n 1 0^n. Since |w| = 2n+1 ≥ n, the Pumping Lemma applies. Since |xy| ≤ n, both x and y consist entirely of 0s from the first block. When we pump y (e.g. pump out with i=0), the resulting string has fewer 0s on the left side than on the right side (0^(n-|y|) 1 0^n), which is no longer a palindrome. Thus L is not regular.'
  },
  {
    id: 'hot-3',
    section: '4.4',
    title: 'Minimization Uniqueness & Unreachable States',
    prompt: 'Suppose a DFA has 10 states, but 3 of those states are unreachable from the start state q0. If you run the Table-Filling Minimization algorithm directly on all 10 states without first removing unreachable states, what will happen? Will the resulting minimized machine have redundant or incorrect states?',
    difficulty: 'Master',
    hints: [
      'Can unreachable states be distinguished from reachable states by any input string starting at q0?',
      'How does the Myhill-Nerode theorem view states that cannot be reached from the initial state?'
    ],
    sampleSolution: 'Unreachable states can never be reached by any input string starting from q0. In the table-filling algorithm, an unreachable state p might be marked distinguishable from reachable states, or it might remain indistinguishable from another unreachable state. However, when we extract the equivalence classes reachable from q0 to form the final minimized DFA, all unreachable states are discarded anyway. Pre-cleaning unreachable states is good practice to avoid useless table rows, but the final reachable minimized machine is still correct and unique.'
  }
];

export const PBL_CHALLENGES: PblChallenge[] = [
  {
    id: 'pbl-1',
    title: 'Compiler Lexical Tokenizer & Identifier Scanner',
    domain: 'Compiler Design (Section 3.3)',
    scenario: 'You are building a frontend scanner for a new programming language "NovaScript". The scanner must recognize integer literals, floating-point numbers, variable identifiers (starting with a letter followed by alphanumeric characters), and arithmetic operators (+, -, *, /).',
    task: 'Design regular expressions for each token category, resolve ambiguity using the Maximal Munch principle, and construct a DFA that classifies input tokens correctly.',
    evaluationCriteria: [
      'Correct regex for identifiers ([a-zA-Z][a-zA-Z0-9]*)',
      'Accurate handling of floating point vs integer numbers ([0-9]+(\\.[0-9]+)?)',
      'Maximal munch rule implementation (e.g. "if" vs identifier "iffy")',
      'Test cases passing with live token stream output'
    ]
  },
  {
    id: 'pbl-2',
    title: 'Network Firewall Packet Header Validator',
    domain: 'Cybersecurity & Protocol Verification (Section 3.2 & 4.2)',
    scenario: 'An enterprise network firewall needs to inspect incoming packet header byte sequences to detect specific malicious payload signatures or unauthorized protocol handshakes represented by regular expressions.',
    task: 'Using closure properties (Section 4.2) and regex-to-DFA conversion, combine two firewall rule regexes (Rule A: starts with 01*0 and ends with 1; Rule B: contains substring 110) into a single optimized product DFA.',
    evaluationCriteria: [
      'Correct construction of individual NFAs for Rule A and Rule B',
      'Application of product construction for intersection/union rules',
      'Verification of packet trace inputs against the combined DFA',
      'Analysis of state count and performance efficiency'
    ]
  },
  {
    id: 'pbl-3',
    title: 'DNA Motif Pattern Matcher in Bioinformatics',
    domain: 'Genomics & Pattern Matching (Section 3.1 & 3.3)',
    scenario: 'Bioinformaticians analyzing genetic sequences need to find conserved promoter motifs (e.g. TATA-box variants: TATAAA or TATAWA where W is A or T) across large DNA strands (A, C, G, T).',
    task: 'Design a regular expression for degenerate nucleotide motifs and simulate a pattern matching automaton that highlights all matching indices in a genetic sequence string.',
    evaluationCriteria: [
      'Accurate use of union operators for ambiguous nucleotides (W = a+t, S = c+g)',
      'Simulation of NFA/DFA matching on real genomic strings',
      'Analysis of time complexity and overlap handling'
    ]
  }
];
