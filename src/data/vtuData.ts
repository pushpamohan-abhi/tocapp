export interface VtuQuestion {
  id: string;
  question: string;
  marks: number;
  module: number;
  answerKey: string;
}

export interface ModuleQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const VTU_QUESTION_BANKS: Record<number, VtuQuestion[]> = {
  1: [
    {
      id: 'vtu_1_0_1',
      question: '[Padma Reddy Syllabus - Set Theory] (a) Define a Set, Power Set, and Cartesian Product. Given A = {a, b, c} and B = {1, 2}, construct P(A) and A × B. (b) State and prove the Principle of Mathematical Induction for 1 + 2 + ... + n = n(n+1)/2.',
      marks: 10,
      module: 1,
      answerKey: `**Part (a) Set Theory Concepts & Constructions:**
1. **Set:** An unordered collection of distinct elements.
2. **Power Set P(A):** The set of all subsets of set A. For |A| = n, cardinality |P(A)| = 2^n.
   For A = {a, b, c}, |A| = 3:
   P(A) = { ∅, {a}, {b}, {c}, {a,b}, {a,c}, {b,c}, {a,b,c} }.
   Cardinality |P(A)| = 2^3 = 8 elements.
3. **Cartesian Product A × B:** The set of all ordered pairs (a, b) where a ∈ A and b ∈ B.
   For A = {a, b, c} and B = {1, 2}:
   A × B = { (a,1), (a,2), (b,1), (b,2), (c,1), (c,2) }.
   Cardinality |A × B| = |A| × |B| = 3 × 2 = 6 pairs.

**Part (b) Mathematical Induction Proof:**
- **Statement P(n):** 1 + 2 + 3 + ... + n = n(n + 1) / 2
- **Basis Step (n = 1):** LHS = 1, RHS = 1(1 + 1)/2 = 1. LHS = RHS. Basis step holds.
- **Inductive Hypothesis:** Assume P(k) is true for arbitrary k ≥ 1:
  1 + 2 + ... + k = k(k + 1) / 2.
- **Inductive Step (n = k + 1):** We must prove P(k + 1):
  LHS = [1 + 2 + ... + k] + (k + 1) = [k(k + 1)/2] + (k + 1)
      = (k + 1) [ (k/2) + 1 ] = (k + 1)(k + 2)/2 = RHS.
- **Conclusion:** By PMI, P(n) holds for all positive integers n ≥ 1.`
    },
    {
      id: 'vtu_1_0_2',
      question: '[Padma Reddy Syllabus - Binary Relations] Define Binary Relation, Reflexive, Symmetric, and Transitive properties. Prove that relation a R b iff (a - b) is divisible by 4 on set ℤ is an equivalence relation.',
      marks: 8,
      module: 1,
      answerKey: `**1. Definitions:**
- **Binary Relation R:** A subset of Cartesian product A × A.
- **Reflexive:** ∀a ∈ A, (a, a) ∈ R.
- **Symmetric:** ∀a, b ∈ A, (a, b) ∈ R ⇒ (b, a) ∈ R.
- **Transitive:** ∀a, b, c ∈ A, (a, b) ∈ R ∧ (b, c) ∈ R ⇒ (a, c) ∈ R.
- **Equivalence Relation:** A relation satisfying Reflexive, Symmetric, and Transitive simultaneously.

**2. Proof for a ≡ b (mod 4):**
- **Reflexive:** For any a ∈ ℤ, a - a = 0 = 4(0). Divisible by 4 ⇒ a R a.
- **Symmetric:** If a R b, then a - b = 4k ⇒ b - a = 4(-k). Since -k ∈ ℤ, b R a.
- **Transitive:** If a R b and b R c, then a - b = 4k1 and b - c = 4k2.
  Sum: (a - b) + (b - c) = 4(k1 + k2) ⇒ a - c = 4(k1 + k2). Divisible by 4 ⇒ a R c.
- **Conclusion:** R is an Equivalence Relation partitioning ℤ into 4 equivalence classes: [0], [1], [2], [3].`
    },
    {
      id: 'vtu_1_1',
      question: 'Define DFA formally as a 5-tuple. Design a DFA to accept strings over alphabet {0, 1} containing even number of 0s and even number of 1s.',
      marks: 10,
      module: 1,
      answerKey: `**Formal Definition of DFA:**
A Deterministic Finite Automaton (DFA) is defined as a 5-tuple M = (Q, Σ, δ, q0, F), where:
1. Q is a finite, non-empty set of states.
2. Σ is a finite, non-empty set of input symbols (alphabet).
3. δ is the transition function mapping Q × Σ → Q.
4. q0 ∈ Q is the designated start state.
5. F ⊆ Q is the set of accepting / final states.

**Design for Even Number of 0s and Even Number of 1s:**
- **Alphabet:** Σ = {0, 1}
- **States (Q):**
  - q00: Even number of 0s, Even number of 1s (Start and Accept State)
  - q01: Even number of 0s, Odd number of 1s
  - q10: Odd number of 0s, Even number of 1s
  - q11: Odd number of 0s, Odd number of 1s
- **Transition Table (δ):**
  - δ(q00, 0) = q10, δ(q00, 1) = q01
  - δ(q01, 0) = q11, δ(q01, 1) = q00
  - δ(q10, 0) = q00, δ(q10, 1) = q11
  - δ(q11, 0) = q01, δ(q11, 1) = q10
- **Accepting States (F):** {q00}

**Explanation:** Each state tracks the parity (even/odd count) of 0s and 1s read so far. Reading '0' toggles the first coordinate parity; reading '1' toggles the second coordinate parity. Returning to q00 ensures both counts are even.`
    },
    {
      id: 'vtu_1_2',
      question: 'Convert the following NFA with ε-transitions to a deterministic finite automaton (DFA) using subset construction.',
      marks: 10,
      module: 1,
      answerKey: `**Subset Construction Algorithm Steps:**
1. **Compute Start State of DFA:** The start state of the DFA is the ε-closure of the NFA's start state q0, denoted as A = ε-closure({q0}).
2. **Transition Function Evaluation:** For each DFA state S and for each input symbol a in Σ:
   a. Compute move(S, a) = set of all transitions from any state in S on symbol a.
   b. Compute the ε-closure of move(S, a), yielding a new subset of states.
   c. If this subset is not already in the DFA state set, add it as a new state.
3. **Mark Accepting States:** Any DFA subset containing at least one NFA accepting state is designated as an accepting state in the resulting DFA.
4. **Repeat:** Continue until all reachable subsets are evaluated and mapped.`
    },
    {
      id: 'vtu_1_3',
      question: 'Explain the distinctions between DFA, NFA, and ε-NFA with suitable state transition table examples.',
      marks: 6,
      module: 1,
      answerKey: `**Detailed Comparison:**
1. **Deterministic Finite Automaton (DFA):**
   - Transition Function: δ: Q × Σ → Q (exactly one next state for every state-symbol pair).
   - Epsilon Transitions: Not allowed.
   - Determinism: At any moment, exactly one deterministic path is taken for any input string.
2. **Nondeterministic Finite Automaton (NFA):**
   - Transition Function: δ: Q × Σ → 2^Q (zero, one, or multiple next states possible).
   - Epsilon Transitions: Not allowed.
   - Determinism: Multiple branches can be explored simultaneously.
3. **NFA with Epsilon Transitions (ε-NFA):**
   - Transition Function: δ: Q × (Σ ∪ {ε}) → 2^Q.
   - Epsilon Transitions: Allows moving between states without consuming any input symbol.
   - Utility: Simplifies regex-to-automata conversions (Thompson's construction).`
    },
    {
      id: 'vtu_1_4',
      question: 'Explain Myhill-Nerode Theorem and state how distinguishable states are identified during DFA minimization.',
      marks: 10,
      module: 1,
      answerKey: `**Myhill-Nerode Theorem:**
Let L be a language. The following statements are equivalent:
1. L is accepted by some DFA.
2. L is the union of equivalence classes of a right-invariant equivalence relation of finite index.
3. The Nerode equivalence relation ~L has finite index, where x ~L y if for all strings z, xz ∈ L <=> yz ∈ L.

**DFA Minimization via Table-Filling (Distinguishability):**
1. **Initialization (Base Case):** For all state pairs (p, q), mark (p, q) as distinguishable if one is accepting (F) and the other is non-accepting (Q \\ F).
2. **Iterative Step:** For unmarked pairs (p, q), compute their next states on symbol a: (p', q') = (δ(p, a), δ(q, a)). If (p', q') is already marked distinguishable, mark (p, q) as distinguishable.
3. **Completion:** Repeat until no new pairs are marked. All remaining unmarked pairs are equivalent and can be merged into single states in the minimal DFA.`
    },
    {
      id: 'vtu_1_5',
      question: 'Design an NFA-ε for the regular expression (0+1)*00(0+1)* and convert it to NFA without ε-transitions.',
      marks: 10,
      module: 1,
      answerKey: `**Step-by-Step Construction:**
1. **Thompson's Construction for (0+1)*00(0+1)*:**
   - (0+1)* creates a sub-automaton looping on both 0 and 1.
   - 00 enforces two consecutive 0 symbols.
   - (0+1)* allows trailing arbitrary bits.
2. **Elimination of ε-Transitions:**
   - For every state q in the NFA-ε, compute its ε-closure.
   - Construct new transitions: if state p is in ε-closure(q) and there is a transition from p on symbol a to r, add transition from q on a to all states in ε-closure(r).
   - Update final states: if ε-closure(q) contains any original accepting state, make q an accepting state in the resulting NFA.`
    }
  ],
  2: [
    {
      id: 'vtu_2_1',
      question: 'State and prove the Pumping Lemma for regular languages. Prove that L = {0^n 1^n | n ≥ 0} is not regular.',
      marks: 10,
      module: 2,
      answerKey: `**Pumping Lemma Statement:**
Let L be a regular language. Then there exists an integer n (pumping length) such that for every string s ∈ L with |s| ≥ n, s can be partitioned into three substrings, s = xyz, satisfying:
1. |xy| ≤ n
2. |y| ≥ 1
3. For all i ≥ 0, xy^iz ∈ L.

**Proof that L = {0^n 1^n | n ≥ 0} is not regular:**
1. **Proof by Contradiction:** Assume L is regular. Let n be the pumping length given by the Pumping Lemma.
2. **Choose String:** Consider s = 0^n 1^n ∈ L. Note that |s| = 2n ≥ n.
3. **Apply Lemma:** By the lemma, s = xyz with |xy| ≤ n and |y| ≥ 1. Since |xy| ≤ n and the prefix consists solely of 0s, y must consist entirely of 0s (say y = 0^k where k ≥ 1).
4. **Pump the String:** Choose i = 2. The pumped string is xy^2z = 0^(n+k) 1^n.
5. **Contradiction:** Since k ≥ 1, n+k > n, so there are more 0s than 1s in the pumped string. Thus xy^2z ∉ L, contradicting the Pumping Lemma. Therefore, L is not regular.`
    },
    {
      id: 'vtu_2_2',
      question: 'Write regular expressions for: (i) Strings of 0s and 1s ending in 01. (ii) Strings with alternating 0s and 1s.',
      marks: 6,
      module: 2,
      answerKey: `**Detailed Solutions:**
(i) **Strings ending in 01:**
   - Any sequence of 0s and 1s can precede '01'.
   - Regular Expression: \`(0+1)*01\`

(ii) **Strings with alternating 0s and 1s:**
   - Can start with 0 or 1, followed by alternating pairs or single characters.
   - Regular Expression: \`(01)* + (10)* + 0(10)* + 1(01)* + ε\` or simply \`((01)* + (10)* + 0(10)* + 1(01)*)\`.`
    },
    {
      id: 'vtu_2_3',
      question: 'Explain closure properties of regular languages under union, concatenation, Kleene closure, reversal, and homomorphism.',
      marks: 8,
      module: 2,
      answerKey: `**Closure Properties Summary:**
1. **Union (L1 ∪ L2):** If L1 and L2 are regular, construct a new start state with ε-transitions to the start states of both NFAs. Result is regular.
2. **Concatenation (L1L2):** Add ε-transitions from all accepting states of NFA1 to the start state of NFA2.
3. **Kleene Closure (L*):** Add a new start state with an ε-transition to the inner NFA start state and back-edges from accepting states.
4. **Reversal (L^R):** Reverse all edge directions, swap start and final states, and introduce a new start state connected to old final states via ε.
5. **Homomorphism:** Substitute every terminal symbol in regular expressions with its corresponding homomorphic string.`
    },
    {
      id: 'vtu_2_4',
      question: 'State Arden\'s Theorem for regular expressions. Using Arden\'s theorem, find the regular expression for the DFA defined by transition equations.',
      marks: 10,
      module: 2,
      answerKey: `**Arden's Theorem:**
Let P and Q be regular expressions over alphabet Σ. If P does not contain ε, then the equation R = Q + RP has a unique solution given by:
\`R = QP*\`

**Application to DFA Equations:**
1. Write state equations for each state qi in terms of incoming transitions:
   - q0 = ε + q00 + q10
   - q1 = q01
2. Solve algebraically using Arden's theorem to eliminate recursive state variables and obtain the regular expression for the accepting state.`
    },
    {
      id: 'vtu_2_5',
      question: 'Explain decision algorithms for regular languages: membership, emptiness, finiteness, and equivalence testing.',
      marks: 10,
      module: 2,
      answerKey: `**Decision Algorithms:**
1. **Membership Problem:** Given string w and DFA M, simulate M on w. Time complexity O(|w|).
2. **Emptiness Problem:** Test if any accepting state is reachable from the start state using graph traversal (BFS/DFS).
3. **Finiteness Problem:** Test if there is a cycle in the DFA state transition graph that is reachable from the start state and can reach an accepting state. If cycles exist, language is infinite; otherwise finite.
4. **Equivalence Testing:** Construct the product DFA of M1 and M2 and check if any state in the symmetric difference is accepting and reachable.`
    }
  ],
  3: [
    {
      id: 'vtu_3_1',
      question: 'Define Context-Free Grammar (CFG). Construct a CFG for the language L = {a^n b^n | n ≥ 1}.',
      marks: 8,
      module: 3,
      answerKey: `**Formal Definition of CFG:**
A Context-Free Grammar is a 4-tuple G = (V, T, P, S), where:
1. V is a finite set of non-terminal variables.
2. T is a finite set of terminal symbols (disjoint from V).
3. P is a finite set of production rules of the form A → α, where A ∈ V and α ∈ (V ∪ T)*.
4. S ∈ V is the designated start symbol.

**CFG for L = {a^n b^n | n ≥ 1}:**
- Variables: V = {S}
- Terminals: T = {a, b}
- Start Symbol: S
- Productions (P):
  \`S → aSb | ab\`
- **Explanation:** Each recursive step of S generates an equal number of matching a\'s on the left and b\'s on the right, terminating with the base pair \`ab\`.`
    },
    {
      id: 'vtu_3_2',
      question: 'What is ambiguity in CFG? Show that the expression grammar E → E + E | E * E | id is ambiguous for string id + id * id.',
      marks: 10,
      module: 3,
      answerKey: `**Ambiguity Definition:**
A grammar G is said to be ambiguous if there exists at least one string in L(G) that has two or more distinct parse trees (or equivalently, two distinct leftmost derivations).

**Demonstration for id + id * id:**
- **Parse Tree 1 (Addition evaluated first):**
  - E → E + E → (E + E) * E ... yielding (id + id) * id (incorrect precedence).
- **Parse Tree 2 (Multiplication evaluated first):**
  - E → E + (E * E) ... yielding id + (id * id) (correct standard precedence).
- **Conclusion:** Because the string \`id + id * id\` admits two distinct parse trees, the grammar is ambiguous.`
    },
    {
      id: 'vtu_3_3',
      question: 'Explain Chomsky Normal Form (CNF). Convert a given CFG to CNF.',
      marks: 10,
      module: 3,
      answerKey: `**Chomsky Normal Form Definition:**
A CFG is in Chomsky Normal Form if all production rules are of the form:
- \`A → BC\` (where B and C are non-terminals)
- \`A → a\` (where a is a terminal)
*(Note: S → ε is permitted only if start symbol S does not appear on any right-hand side).*

**Conversion Procedure:**
1. **Eliminate ε-productions:** Remove nullable variables and generate all production combinations.
2. **Eliminate Unit Productions:** Remove rules of form A → B by replacing them with B's right-hand sides.
3. **Eliminate Useless Symbols:** Remove non-generating or unreachable variables.
4. **Chomsky Normalization:** Replace terminals in long right-hand sides with fresh non-terminals and break binary non-terminal chains into binary branching rules.`
    },
    {
      id: 'vtu_3_4',
      question: 'Define Pushdown Automata (PDA) formally as a 7-tuple. Explain acceptance by final state and acceptance by empty stack.',
      marks: 10,
      module: 3,
      answerKey: `**Formal Definition of PDA (7-Tuple):**
P = (Q, Σ, Γ, δ, q0, Z0, F), where:
1. Q: Finite set of states.
2. Σ: Input alphabet.
3. Γ: Stack alphabet.
4. δ: Transition function Q × (Σ ∪ {ε}) × Γ → 2^(Q × Γ*).
5. q0: Start state.
6. Z0: Initial stack symbol.
7. F: Set of accepting states.

**Acceptance Modes:**
1. **Acceptance by Final State:** The PDA accepts input w if starting from configuration (q0, w, Z0), the machine reaches any state in F after consuming all input.
2. **Acceptance by Empty Stack:** The PDA accepts input w if starting from (q0, w, Z0), the machine empties its stack entirely (stack = ε) after consuming all input, regardless of the final state.`
    },
    {
      id: 'vtu_3_5',
      question: 'Construct a PDA for the language L = {w c w^R | w ∈ {a, b}*}.',
      marks: 10,
      module: 3,
      answerKey: `**PDA Construction Steps for L = {w c w^R}:**
1. **Push Phase:** Read input symbols (a or b) from the first half w and push them onto the stack. Stay in state q0.
   - \`δ(q0, a, Z) = {(q0, aZ)}, δ(q0, b, Z) = {(q0, bZ)}\`
2. **Center Marker Transition:** When marker \`c\` is encountered, transition from state q0 to state q1 without modifying the stack.
   - \`δ(q0, c, X) = {(q1, X)}\`
3. **Pop and Match Phase:** Read input symbols in w^R and pop matching stack symbols.
   - \`δ(q1, a, a) = {(q1, ε)}, δ(q1, b, b) = {(q1, ε)}\`
4. **Acceptance:** When input is fully consumed and bottom marker Z0 is exposed, transition to accepting state q_accept.`
    }
  ],
  4: [
    {
      id: 'vtu_4_1',
      question: 'Explain Greibach Normal Form (GNF) and state the procedure to convert a CFG into GNF.',
      marks: 10,
      module: 4,
      answerKey: `**Greibach Normal Form Definition:**
A CFG is in Greibach Normal Form (GNF) if all production rules are of the form:
\`A → aα\`
where \`a\` is a terminal and \`α\` is a sequence (possibly empty) of non-terminal variables.

**Conversion Procedure:**
1. Convert CFG to Chomsky Normal Form (CNF).
2. Order variables as A1, A2, ..., An.
3. Eliminate left recursion for variables Ai.
4. Transform productions so that right-hand sides start with terminals by iterative substitution from An down to A1.`
    },
    {
      id: 'vtu_4_2',
      question: 'State and explain the Pumping Lemma for Context-Free Languages. Prove that L = {a^n b^n c^n | n ≥ 0} is not context-free.',
      marks: 10,
      module: 4,
      answerKey: `**Pumping Lemma for CFLs:**
Let L be a CFL. There exists a constant n such that for every string s ∈ L with |s| ≥ n, s can be written as s = uvwxy such that:
1. |vwx| ≤ n
2. |vx| ≥ 1
3. For all i ≥ 0, uv^iwx^iy ∈ L.

**Proof that L = {a^n b^n c^n} is not context-free:**
1. Assume L is context-free with pumping length n.
2. Choose s = a^n b^n c^n.
3. By the lemma, s = uvwxy with |vwx| ≤ n. Because of the length constraint, vwx can span at most two distinct symbol types (e.g., a's and b's, or b's and c's), but cannot span all three (a, b, and c).
4. Pumping v and x increases the count of some symbols while leaving others unchanged, resulting in an unbalanced string not in L. Contradiction!`
    },
    {
      id: 'vtu_4_3',
      question: 'Explain closure properties of Context-Free Languages. Are CFLs closed under intersection and complementation? Justify.',
      marks: 8,
      module: 4,
      answerKey: `**CFL Closure Properties:**
- **Closed Under:** Union, Concatenation, Kleene Star, Reversal, Substitution, and Homomorphism.
- **NOT Closed Under Intersection:** For example, L1 = {a^n b^n c^m} and L2 = {a^m b^n c^n} are CFLs, but their intersection L1 ∩ L2 = {a^n b^n c^n} is NOT context-free.
- **NOT Closed Under Complementation:** Since CFLs are not closed under intersection (by De Morgan's Law: L1 ∩ L2 = ¬(¬L1 ∪ ¬L2)), they cannot be closed under complementation either.`
    },
    {
      id: 'vtu_4_4',
      question: 'Describe deterministic pushdown automata (DPDA) and discuss why parsing programming languages relies on DPDAs.',
      marks: 8,
      module: 4,
      answerKey: `**Deterministic Pushdown Automata:**
A DPDA is a pushdown automaton with the restriction that there is at most one legal transition for any combination of state, input symbol (including ε), and stack top symbol. Furthermore, ε-transitions cannot conflict with symbol-consuming transitions.

**Why Programming Languages Rely on DPDAs:**
Programming language syntax (like Java, C++, Python) is designed as deterministic context-free languages (DCFLs). DPDAs enable linear time O(n) parsing (e.g., LR parsers) without backtracking, making compiler syntax analysis extremely fast and efficient.`
    }
  ],
  5: [
    {
      id: 'vtu_5_1',
      question: 'Design a Turing Machine to accept the language L = {0^n 1^n | n ≥ 1}. Show the instantaneous descriptions (IDs) for input 0011.',
      marks: 10,
      module: 5,
      answerKey: `**Turing Machine Algorithm for L = {0^n 1^n}:**
1. Scan right from start, find the leftmost unmarked '0', replace it with marker 'X'.
2. Scan further right to find the leftmost unmarked '1', replace it with marker 'Y'.
3. Head moves back left to find the next unmarked '0' and repeats the pairing process.
4. When all 0s are replaced by X and 1s by Y, accept.

**Instantaneous Descriptions (IDs) for 0011:**
- \`q0 0011\` ⊢ \`X q1 011\` ⊢ \`X 0 q1 11\` ⊢ \`X q2 0 Y 1\` ⊢ \`q2 X 0 Y 1\` ⊢ \`X q0 0 Y 1\` ⊢ \`X X q1 Y 1\` ⊢ \`X X Y q3 1\` ⊢ \`X X q4 Y Y\` ⊢ ... ➔ Accept.`
    },
    {
      id: 'vtu_5_2',
      question: 'Explain Multi-tape Turing machines and Non-deterministic Turing machines. Prove they are equivalent in computing power to standard single-tape TM.',
      marks: 10,
      module: 5,
      answerKey: `**Extensions & Equivalence:**
1. **Multi-tape TMs:** Have k independent tapes and k heads. Can be simulated on a single-tape TM by interleaving k tracks on one tape and using virtual head markers. Time complexity increases from T(n) to O(T(n)^2).
2. **Non-deterministic TMs (NDTM):** Can branch into multiple parallel computation paths. Can be simulated on a 3-tape deterministic TM using a breadth-first search queue of ID configurations.
3. **Conclusion:** Both extensions recognize exactly the same class of languages (Recursively Enumerable languages), proving the robustness of the standard Turing machine model.`
    },
    {
      id: 'vtu_5_3',
      question: 'State and explain the Halting Problem. Prove that the Halting Problem is undecidable using diagonalization.',
      marks: 10,
      module: 5,
      answerKey: `**The Halting Problem:**
Given the description of a Turing machine M and input string w, does M halt (accept or reject) on w, or does it run forever in an infinite loop?

**Proof by Diagonalization (Turing, 1936):**
1. Assume there exists a decider Turing machine H that correctly solves the halting problem for any (M, w).
2. Construct a new auxiliary machine D that takes program code <M> as input, runs H(<M>, <M>), and does the opposite: if H says H halts, D loops forever; if H says H loops, D halts immediately.
3. Feed program code <D> into D.
4. Contradiction: If D halts on <D>, H says it loops (so it loops); if D loops on <D>, H says it halts (so it halts).
5. Therefore, decider H cannot exist. The Halting Problem is undecidable.`
    },
    {
      id: 'vtu_5_4',
      question: 'Define recursive and recursively enumerable languages. Explain Post\'s Correspondence Problem (PCP) and its undecidability.',
      marks: 10,
      module: 5,
      answerKey: `**Recursive vs. Recursively Enumerable:**
- **Recursive Languages (Decidable):** Accepted by a Turing machine that always halts on every input (either accepting or rejecting).
- **Recursively Enumerable Languages (Turing-Recognizable):** Accepted by a TM that halts and accepts valid strings, but may loop forever on invalid strings.

**Post's Correspondence Problem (PCP):**
Given two lists of domino tiles with top strings A = (t1, t2, ..., tk) and bottom strings B = (u1, u2, ..., uk), find a sequence of indices i1, i2, ..., im such that the concatenated top string equals the concatenated bottom string:
\`ti1 ti2 ... tim = ui1 ui2 ... uim\`
PCP is famously proven undecidable by reduction from the Halting Problem.`
    },
    {
      id: 'vtu_5_5',
      question: 'Write short notes on: (i) Universal Turing Machine. (ii) Rice\'s Theorem. (iii) Chomsky Hierarchy.',
      marks: 10,
      module: 5,
      answerKey: `**Short Notes:**
1. **Universal Turing Machine (UTM):** A Turing machine U that takes the encoding of any arbitrary Turing machine <M> and input w, and simulates M's execution on w. Represents the foundational blueprint of stored-program computers.
2. **Rice's Theorem:** Any non-trivial semantic property of recursively enumerable languages is undecidable. (e.g., determining whether a TM accepts a regular language, empty language, or infinite language is impossible to decide algorithmically).
3. **Chomsky Hierarchy:** Classification of formal grammars into 4 tiers: Type 3 (Regular), Type 2 (Context-Free), Type 1 (Context-Sensitive), and Type 0 (Recursively Enumerable).`
    }
  ]
};

export const MODULE_QUIZZES: Record<number, ModuleQuizQuestion[]> = {
  1: [
     {
       id: 'q1_st1',
       question: '[Padma Reddy Set Theory] If a finite set A has 5 elements (|A| = 5), what is the total number of elements in its Power Set P(A)?',
       options: ['5 elements', '10 elements', '25 elements', '32 elements'],
       correctIndex: 3,
       explanation: 'The power set P(A) contains all possible subsets of A. Its cardinality is |P(A)| = 2^n = 2^5 = 32 elements.'
     },
     {
       id: 'q1_st2',
       question: '[Padma Reddy Set Theory] A binary relation R on set A is defined as an Equivalence Relation if and only if it satisfies which set of properties?',
       options: ['Reflexive, Symmetric, and Transitive', 'Reflexive, Antisymmetric, and Transitive', 'Irreflexive, Symmetric, and Asymmetric', 'Injective, Surjective, and Bijective'],
       correctIndex: 0,
       explanation: 'An equivalence relation must simultaneously be Reflexive (aRa), Symmetric (aRb ⇒ bRa), and Transitive (aRb ∧ bRc ⇒ aRc).'
     },
     {
       id: 'q1_st3',
       question: '[Padma Reddy Set Theory] In a Mathematical Induction proof for statement P(n), what does the Inductive Hypothesis step consist of?',
       options: ['Proving P(n) holds for base value n = 1', 'Assuming P(k) holds true for an arbitrary positive integer k ≥ 1', 'Evaluating P(n) for n = 0', 'Proving P(k+1) directly without assumptions'],
       correctIndex: 1,
       explanation: 'The Inductive Hypothesis assumes statement P(k) is true for arbitrary k, which is then used algebraically to prove P(k+1).'
     },
     {
       id: 'q1_st4',
       question: '[Padma Reddy Set Theory] Given sets A = {a, b} and B = {1, 2, 3}, what is the cardinality of the Cartesian Product |A × B|?',
       options: ['5', '6', '8', '9'],
       correctIndex: 1,
       explanation: 'The cardinality of Cartesian product A × B is |A| × |B| = 2 × 3 = 6 ordered pairs.'
     },
     {
       id: 'q1_st5',
       question: '[Padma Reddy Strings & Languages] Given alphabet Σ = {0, 1} and string w = 01100, what is the length |w| and string reversal w^R?',
       options: ['|w| = 5, w^R = 00110', '|w| = 5, w^R = 01100', '|w| = 6, w^R = 10011', '|w| = 4, w^R = 00110'],
       correctIndex: 0,
       explanation: 'The string w = 01100 has 5 symbols (|w| = 5). Reversing the characters from end to beginning yields w^R = 00110.'
     },
     {
       id: 'q1_1',
       question: 'How many states are minimally required in a DFA recognizing binary strings with an odd number of 1s?',
       options: ['1 state', '2 states', '3 states', '4 states'],
       correctIndex: 1,
       explanation: '2 states are needed: one for even count of 1s (start) and one for odd count of 1s.'
     },
     {
       id: 'q1_2',
       question: 'Which formal tuple component specifies the transition relation in an NFA?',
       options: ['Q × Σ → Q', 'Q × (Σ ∪ {ε}) → 2^Q', 'Σ*', 'F ⊆ Q'],
       correctIndex: 1,
       explanation: 'NFA transition function maps state and symbol (including ε) to a subset of states (power set 2^Q).'
     },
     {
       id: 'q1_3',
       question: 'What is the primary purpose of subset construction algorithm?',
       options: ['Minimizing DFA states', 'Converting NFA to equivalent DFA', 'Eliminating useless symbols in CFG', 'Parsing strings'],
       correctIndex: 1,
       explanation: 'Subset construction converts an NFA into an equivalent DFA by tracking sets of NFA states.'
     },
     {
       id: 'q1_4',
       question: 'What does ε-closure(q) represent in an ε-NFA?',
       options: ['Only state q itself', 'Set of all states reachable from q using only ε-transitions', 'All accepting states', 'Transition table'],
       correctIndex: 1,
       explanation: 'ε-closure(q) includes q and all states reachable via zero or more ε-transitions.'
     },
     {
       id: 'q1_5',
       question: 'In DFA minimization, two states p and q are merged if:',
       options: ['They have the same name', 'They are equivalent (indistinguishable for all input strings)', 'They are both start states', 'They are non-accepting'],
       correctIndex: 1,
       explanation: 'Equivalent states that yield identical acceptance behavior for all test strings are merged.'
     },
     {
       id: 'q1_6',
       question: '[Problem Solving] An NFA has 4 states. What is the maximum number of states in the equivalent DFA constructed via subset construction?',
       options: ['4 states', '8 states', '16 states', '32 states'],
       correctIndex: 2,
       explanation: 'An NFA with n states has at most 2^n states in its subset-constructed DFA. For n = 4, 2^4 = 16 states.'
     },
     {
       id: 'q1_7',
       question: '[Problem Solving] Design problem: A DFA over {0, 1} accepts all strings starting with 1 and ending with 0. What is the minimum number of states required?',
       options: ['3 states', '4 states', '5 states', '6 states'],
       correctIndex: 1,
       explanation: '4 states are required: q_start, q_saw1 (accepted prefix), q_trap (started with 0), and q_accept (ends in 0 after starting with 1).'
     }
  ],
  2: [
     {
       id: 'q2_1',
       question: 'What is the pumping length constant n in the Pumping Lemma for regular languages?',
       options: ['Length of string', 'Number of states in the minimal DFA', 'Alphabet size', 'Zero'],
       correctIndex: 1,
       explanation: 'By the Myhill-Nerode theorem / pigeonhole principle, n is the number of states in the minimal DFA.'
     },
     {
       id: 'q2_2',
       question: 'Are regular languages closed under complementation?',
       options: ['Yes', 'No', 'Only for finite alphabets', 'Only for deterministic TMs'],
       correctIndex: 0,
       explanation: 'Yes, by swapping accepting and non-accepting states in a complete DFA.'
     },
     {
       id: 'q2_3',
       question: 'What is Arden\'s theorem used for?',
       options: ['Solving regular expressions from state equations', 'Minimizing DFA', 'Parsing context-free grammars', 'Proving undecidability'],
       correctIndex: 0,
       explanation: 'Arden\'s Theorem solves equations of form R = Q + RP to find regular expressions.'
     },
     {
       id: 'q2_4',
       question: 'Which of the following operations is NOT closed for regular languages?',
       options: ['Union', 'Concatenation', 'Intersection', 'None (regular languages are closed under all these)'],
       correctIndex: 3,
       explanation: 'Regular languages are closed under union, concatenation, and intersection.'
     },
     {
       id: 'q2_5',
       question: 'The language L = {0^n 1^n | n ≥ 0} is:',
       options: ['Regular', 'Not regular', 'Context-sensitive only', 'Undecidable'],
       correctIndex: 1,
       explanation: 'L = {0^n 1^n} requires unbounded memory and cannot be recognized by any finite automaton.'
     },
     {
       id: 'q2_6',
       question: '[Problem Solving] Given string s = 0^n 1^n in Pumping Lemma proof, if |xy| ≤ n, what do substrings x and y consist of?',
       options: ['Only 1s', 'Only 0s', 'Both 0s and 1s', 'Epsilon'],
       correctIndex: 1,
       explanation: 'Because |xy| ≤ n and the prefix of s = 0^n 1^n consists entirely of n zeros, both x and y must consist solely of 0s.'
     },
     {
       id: 'q2_7',
       question: '[Problem Solving] Apply Arden\'s theorem to solve R = Q + RP where Q = 0 and P = 1. What is R?',
       options: ['01*', '1*0', '(0+1)*', '0*1'],
       correctIndex: 0,
       explanation: 'By Arden\'s Theorem, R = QP* = 0(1)* = 01*.'
     }
  ],
  3: [
     {
       id: 'q3_1',
       question: 'Which normal form requires all productions to be of the form A → BC or A → a?',
       options: ['Greibach Normal Form', 'Chomsky Normal Form', 'Prenex Normal Form', 'Standard Form'],
       correctIndex: 1,
       explanation: 'Chomsky Normal Form (CNF) restricts rules to binary non-terminal or single terminal right hand sides.'
     },
     {
       id: 'q3_2',
       question: 'What does ambiguity in a Context-Free Grammar imply?',
       options: ['Multiple parse trees for at least one string', 'No parse tree exists', 'Infinite states', 'Non-determinism in DFA'],
       correctIndex: 0,
       explanation: 'An ambiguous grammar yields two or more distinct parse trees for the same string.'
     },
     {
       id: 'q3_3',
       question: 'Which memory structure distinguishes Pushdown Automata from Finite Automata?',
       options: ['Queue', 'Stack (LIFO)', 'Random Access Memory', 'Tape'],
       correctIndex: 1,
       explanation: 'PDA uses a stack to store symbols and check nested structures.'
     },
     {
       id: 'q3_4',
       question: 'A CFG is in Chomsky Normal Form if productions are:',
       options: ['A → BC or A → a', 'A → aB', 'S → ε only', 'A → BCD'],
       correctIndex: 0,
       explanation: 'CNF rules are strictly two non-terminals (A → BC) or one terminal (A → a).'
     },
     {
       id: 'q3_5',
       question: 'Which of the following is accepted by a Pushdown Automata?',
       options: ['{0^n 1^n | n ≥ 1}', '{0^n 1^n 2^n | n ≥ 1}', 'Non-context-free languages', 'All languages'],
       correctIndex: 0,
       explanation: '{0^n 1^n} is a classic context-free language accepted by PDA using stack matching.'
     },
     {
       id: 'q3_6',
       question: '[Problem Solving] How many production steps in CNF are required to derive a string of length n (where n ≥ 1)?',
       options: ['n steps', '2n - 1 steps', 'n^2 steps', 'log n steps'],
       correctIndex: 1,
       explanation: 'In CNF, every derivation tree for string of length n has exactly 2n - 1 nodes (n leaves and n - 1 binary internal nodes).'
     },
     {
       id: 'q3_7',
       question: '[Problem Solving] In designing a PDA for L = {w c w^R}, when reading the middle marker c, how should the stack be updated?',
       options: ['Push c onto stack', 'Pop top symbol', 'Leave stack completely unchanged', 'Clear entire stack'],
       correctIndex: 2,
       explanation: 'Marker c simply signals transition from push phase to pop phase without altering stack contents.'
     }
  ],
  4: [
     {
       id: 'q4_1',
       question: 'In Greibach Normal Form (GNF), every production must start with:',
       options: ['A non-terminal', 'A single terminal followed by zero or more non-terminals', 'Epsilon only', 'Three non-terminals'],
       correctIndex: 1,
       explanation: 'GNF requires rules of form A → aα where a is a terminal and α is a string of non-terminals.'
     },
     {
       id: 'q4_2',
       question: 'Are Context-Free Languages closed under intersection?',
       options: ['Yes', 'No', 'Only for finite alphabets', 'Always'],
       correctIndex: 1,
       explanation: 'CFLs are NOT closed under intersection (e.g., intersection of two CFLs can be non-CFL like {a^n b^n c^n}).'
     },
     {
       id: 'q4_3',
       question: 'The pumping lemma for CFLs uses how many parts in splitting s = uvwxy?',
       options: ['2 parts', '3 parts', '5 parts', '7 parts'],
       correctIndex: 2,
       explanation: 'CFL pumping lemma splits string into five segments uvwxy satisfying |vx| ≥ 1 and |vwx| ≤ n.'
     },
     {
       id: 'q4_4',
       question: 'Deterministic Pushdown Automata (DPDA) recognize:',
       options: ['All context-free languages', 'Strict subset of context-free languages (Deterministic CFLs)', 'Only regular languages', 'Turing computable languages'],
       correctIndex: 1,
       explanation: 'DPDAs recognize deterministic CFLs, which are strictly a subset of all CFLs.'
     },
     {
       id: 'q4_5',
       question: 'Which tool is best suited for syntax analysis in programming language compilers?',
       options: ['DFA', 'DPDA / LR Parsers', 'Turing Machine', 'NFA'],
       correctIndex: 1,
       explanation: 'DPDAs and LR parsers efficiently parse deterministic context-free programming language constructs.'
     },
     {
       id: 'q4_6',
       question: '[Problem Solving] When applying the CFL Pumping Lemma to L = {a^n b^n c^n}, why does the condition |vwx| ≤ n prevent pumping across all three blocks?',
       options: ['Because n is too large', 'Because vwx length is bounded by n, it cannot span all three separated blocks of a, b, and c simultaneously', 'Because grammar is ambiguous', 'Because stack overflows'],
       correctIndex: 1,
       explanation: 'Since |vwx| ≤ n, the substring vwx cannot span more than n positions, making it impossible to cover a, b, and c blocks simultaneously.'
     }
  ],
  5: [
     {
       id: 'q5_1',
       question: 'Who proposed the Turing machine model of computation in 1936?',
       options: ['Alan Turing', 'Noam Chomsky', 'Stephen Kleene', 'John Hopcroft'],
       correctIndex: 0,
       explanation: 'Alan Turing introduced Turing machines in his seminal 1936 paper.'
     },
     {
       id: 'q5_2',
       question: 'The Halting Problem asks whether:',
       options: ['A TM halts on a given input string', 'A TM accepts all strings', 'A CFG is ambiguous', 'Two regular expressions are equivalent'],
       correctIndex: 0,
       explanation: 'The halting problem determines if arbitrary program M will halt or run forever on input w.'
     },
     {
       id: 'q5_3',
       question: 'Are recursively enumerable languages closed under complementation?',
       options: ['Yes', 'No', 'Only for finite alphabets', 'Always'],
       correctIndex: 1,
       explanation: 'RE languages are not closed under complementation; if a language and its complement are both RE, it is decidable (recursive).'
     },
     {
       id: 'q5_4',
       question: 'Post\'s Correspondence Problem (PCP) is an example of an:',
       options: ['Undecidable problem', 'NP-complete sorting algorithm', 'Regular language', 'Context-free grammar property'],
       correctIndex: 0,
       explanation: 'PCP is a classic undecidable decision problem regarding domino matching.'
     },
     {
       id: 'q5_5',
       question: 'What is a Universal Turing Machine (UTM)?',
       options: ['A TM that can simulate any other TM given its encoding', 'A machine with infinite tapes', 'A non-deterministic parser', 'A DFA'],
       correctIndex: 0,
       explanation: 'UTM takes the description of any Turing machine M and input w and simulates M\'s execution.'
     },
     {
       id: 'q5_6',
       question: '[Problem Solving] In the diagonalization proof of the Halting Problem, if decider H claims to halt and return true when M halts on w, what does machine D do when fed code <D>?',
       options: ['Halts immediately', 'Loops forever', 'Returns an error code', 'Accepts the string'],
       correctIndex: 1,
       explanation: 'Machine D is constructed to do the opposite of H: if H says D halts on <D>, D enters an infinite loop, creating a direct contradiction.'
     }
  ]
};
