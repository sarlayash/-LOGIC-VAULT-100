// ==========================================================================
// KAPIL'S LOGIC-VAULT 100: 30 Core DSA Patterns & Algorithmic Templates
// Powered By Kapil • SarlaYash Learning Solutions LLP
// ==========================================================================

const DSA_PATTERNS = [
  {
    id: "dsa_01",
    name: "Array Traversal",
    coreLogic: "Visit every element once",
    category: "Arrays & Searching",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    icon: "arrow-right",
    whenToUse: "When scanning linear collections, finding min/max, linear search, or accumulating state across records.",
    template: `FUNCTION traverse_array(arr):
    INITIALIZE result = 0
    FOR index FROM 0 TO LENGTH(arr) - 1:
        element = arr[index]
        PROCESS(element)
    END FOR
    RETURN result
END FUNCTION`,
    classicalProblems: ["Find Max Element", "Linear Search", "Count Occurrences", "Array Inversion Count"],
    industryMapping: ["#007 KYC Document Expiry Monitor", "#014 Lab Sample Tracking", "#067 Carbon Emissions Ledger"]
  },
  {
    id: "dsa_02",
    name: "Two Pointer",
    coreLogic: "Two indices moving together/opposite",
    category: "Pointers & Windows",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    icon: "chevrons-right-left",
    whenToUse: "Sorted arrays, palindrome verification, pair sum targets, partitioning, or reversing in place.",
    template: `FUNCTION two_pointer_converge(arr, target):
    INITIALIZE left = 0, right = LENGTH(arr) - 1
    WHILE left < right:
        current_sum = arr[left] + arr[right]
        IF current_sum == target THEN
            RETURN [left, right]
        ELSE IF current_sum < target THEN
            left = left + 1
        ELSE
            right = right - 1
        END IF
    END WHILE
    RETURN NOT_FOUND
END FUNCTION`,
    classicalProblems: ["Two Sum (Sorted)", "Container With Most Water", "Valid Palindrome", "Remove Duplicates"],
    industryMapping: ["#027 Retail Queue Staffing", "#034 Purchase Order Exception Handler", "#044 Campus Placement Slot Scheduler"]
  },
  {
    id: "dsa_03",
    name: "Sliding Window (Fixed)",
    coreLogic: "Fixed-size window moves",
    category: "Pointers & Windows",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    icon: "crop",
    whenToUse: "Aggregating metrics (sum, average, anomalies) over fixed consecutive k intervals or hourly rolling windows.",
    template: `FUNCTION sliding_window_fixed(arr, k):
    INITIALIZE window_sum = 0
    FOR i FROM 0 TO k - 1:
        window_sum = window_sum + arr[i]
    END FOR
    max_sum = window_sum
    FOR i FROM k TO LENGTH(arr) - 1:
        window_sum = window_sum + arr[i] - arr[i - k]
        max_sum = MAX(max_sum, window_sum)
    END FOR
    RETURN max_sum
END FUNCTION`,
    classicalProblems: ["Max Sum Subarray of Size K", "First Negative Number in Window of Size K", "Average of Subarrays of Size K"],
    industryMapping: ["#005 ATM Cash Replenishment", "#046 Cloud Cost Anomaly Detector", "#050 API Rate-Limit Protection"]
  },
  {
    id: "dsa_04",
    name: "Sliding Window (Variable)",
    coreLogic: "Expand and shrink window",
    category: "Pointers & Windows",
    timeComplexity: "O(N)",
    spaceComplexity: "O(K)",
    icon: "maximize-2",
    whenToUse: "Finding longest/shortest valid substring or subarray meeting a dynamic constraint condition.",
    template: `FUNCTION sliding_window_variable(arr, condition_limit):
    INITIALIZE left = 0, current_metric = 0, max_len = 0
    FOR right FROM 0 TO LENGTH(arr) - 1:
        ADD arr[right] TO current_metric
        WHILE NOT VALID(current_metric, condition_limit) AND left <= right:
            REMOVE arr[left] FROM current_metric
            left = left + 1
        END WHILE
        max_len = MAX(max_len, right - left + 1)
    END FOR
    RETURN max_len
END FUNCTION`,
    classicalProblems: ["Smallest Subarray with Given Sum", "Longest Substring Without Repeating Characters", "Subarray Product Less Than K"],
    industryMapping: ["#002 Duplicate Payment Detection", "#018 Cold-Chain Temperature Excursion", "#089 Digital Ad Pacing Controller"]
  },
  {
    id: "dsa_05",
    name: "HashMap / Frequency",
    coreLogic: "Store key-value pairs for counting and fast lookup",
    category: "Hashing & Tables",
    timeComplexity: "O(1) average lookup",
    spaceComplexity: "O(N)",
    icon: "database",
    whenToUse: "O(1) item lookup, frequencies, counting occurrences, deduplication, caching, grouping by attribute.",
    template: `FUNCTION frequency_counter(records):
    INITIALIZE freq_map = NEW HASH_MAP()
    FOR EACH item IN records:
        key = item.identifier
        freq_map[key] = (freq_map[key] OR 0) + 1
    END FOR
    RETURN freq_map
END FUNCTION`,
    classicalProblems: ["Two Sum (Unsorted)", "Group Anagrams", "Top K Frequent Elements", "Subarray Sum Equals K"],
    industryMapping: ["#002 Duplicate Payment Detection", "#007 KYC Document Expiry Monitor", "#090 Subscription Entitlement Reconciliation"]
  },
  {
    id: "dsa_06",
    name: "HashSet",
    coreLogic: "Fast lookup of uniqueness",
    category: "Hashing & Tables",
    timeComplexity: "O(1) average",
    spaceComplexity: "O(N)",
    icon: "check-circle",
    whenToUse: "Deduplicating elements, cycle detection, set intersections, membership verification.",
    template: `FUNCTION find_uniques(stream):
    INITIALIZE seen_set = NEW HASH_SET()
    INITIALIZE duplicates = []
    FOR EACH token IN stream:
        IF seen_set.CONTAINS(token) THEN
            APPEND token TO duplicates
        ELSE
            seen_set.ADD(token)
        END IF
    END FOR
    RETURN duplicates
END FUNCTION`,
    classicalProblems: ["Contains Duplicate", "Intersection of Two Arrays", "Longest Consecutive Sequence"],
    industryMapping: ["#040 Training Attendance Reconciliation", "#085 Network Outage Impact Estimator", "#097 Expense Policy Checker"]
  },
  {
    id: "dsa_07",
    name: "Prefix Sum",
    coreLogic: "Running cumulative sum",
    category: "Arrays & Searching",
    timeComplexity: "O(N) build, O(1) query",
    spaceComplexity: "O(N)",
    icon: "trending-up",
    whenToUse: "Constant-time O(1) range sum queries, cumulative balances, runway calculations, 2D grid queries.",
    template: `FUNCTION build_prefix_sum(arr):
    INITIALIZE prefix = ARRAY of size LENGTH(arr) + 1 with 0
    FOR i FROM 0 TO LENGTH(arr) - 1:
        prefix[i + 1] = prefix[i] + arr[i]
    END FOR
    // Range sum query for [L, R] inclusive:
    // query_sum(L, R) = prefix[R + 1] - prefix[L]
    RETURN prefix
END FUNCTION`,
    classicalProblems: ["Range Sum Query (Immutable)", "Subarray Sum Equals K", "Continuous Subarray Sum", "Find Pivot Index"],
    industryMapping: ["#009 Cash-Flow Alert for Small Business", "#061 Electricity Load Forecast Alert", "#099 Consulting Project Margin Watch"]
  },
  {
    id: "dsa_08",
    name: "Binary Search",
    coreLogic: "Search by halving the search space",
    category: "Arrays & Searching",
    timeComplexity: "O(log N)",
    spaceComplexity: "O(1)",
    icon: "search",
    whenToUse: "Search in sorted array, monotonic answer spaces (binary search on answer), threshold bounding, square root.",
    template: `FUNCTION binary_search(arr, target):
    INITIALIZE low = 0, high = LENGTH(arr) - 1
    WHILE low <= high:
        mid = low + FLOOR((high - low) / 2)
        IF arr[mid] == target THEN
            RETURN mid
        ELSE IF arr[mid] < target THEN
            low = mid + 1
        ELSE
            high = mid - 1
        END IF
    END WHILE
    RETURN NOT_FOUND
END FUNCTION`,
    classicalProblems: ["Binary Search", "Find First and Last Position", "Search in Rotated Sorted Array", "Capacity to Ship Packages Within D Days"],
    industryMapping: ["#019 Order Promise-Date Calculator", "#026 Expiry and Markdown Optimiser", "#066 EV Charging Slot Allocation"]
  },
  {
    id: "dsa_09",
    name: "Sorting",
    coreLogic: "Arrange elements in ascending/descending order",
    category: "Arrays & Searching",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(log N) or O(N)",
    icon: "list-ordered",
    whenToUse: "Ordering queues, priority scheduling, deadline ranking, interval merges, canonical preprocessing.",
    template: `FUNCTION sort_by_priority(orders, comparator_fn):
    // Quicksort / Mergesort implementation
    RETURN MERGE_SORT(orders, comparator_fn)
END FUNCTION`,
    classicalProblems: ["Merge Intervals", "Meeting Rooms", "Kth Largest Element", "Sort Colors"],
    industryMapping: ["#004 Insurance Claim Prioritisation", "#010 Emergency Department Queue Triage", "#048 Security Patch Prioritisation"]
  },
  {
    id: "dsa_10",
    name: "Recursion",
    coreLogic: "Function calls itself until a base case",
    category: "Recursion & Trees",
    timeComplexity: "Depends on branching factor",
    spaceComplexity: "O(Depth) call stack",
    icon: "repeat",
    whenToUse: "Divide and conquer, hierarchical tree parsing, nested JSON/BOM BOM traversal, backtracking base structures.",
    template: `FUNCTION solve_recursive(node, state):
    // 1. BASE CASE
    IF node IS NULL OR IS_LEAF(node) THEN
        RETURN EVALUATE_LEAF(node, state)
    END IF
    // 2. RECURSIVE DECOMPOSITION
    result = PROCESS_CURRENT(node)
    FOR EACH child IN node.children:
        result = COMBINE(result, solve_recursive(child, state))
    END FOR
    RETURN result
END FUNCTION`,
    classicalProblems: ["Tree Traversal", "Tower of Hanoi", "Fibonacci Numbers", "Flatten Nested List"],
    industryMapping: ["#033 Quality Defect Containment", "#043 Learning Content Version Control", "#082 Food Traceability Recall"]
  },
  {
    id: "dsa_11",
    name: "Backtracking",
    coreLogic: "Try → Undo → Try Again",
    category: "Recursion & Trees",
    timeComplexity: "Exponential O(K^N)",
    spaceComplexity: "O(N)",
    icon: "undo-2",
    whenToUse: "Constraint satisfaction, generating all permutations, combinations, route exploration, scheduling conflict resolution.",
    template: `FUNCTION backtrack(candidate, path, solutions):
    IF IS_SOLUTION(candidate, path) THEN
        APPEND COPY_OF(path) TO solutions
        RETURN
    END IF
    FOR EACH choice IN GET_VALID_CHOICES(candidate):
        // 1. Make choice
        ADD choice TO path
        // 2. Recurse
        backtrack(candidate, path, solutions)
        // 3. Undo choice (Backtrack)
        REMOVE choice FROM path
    END FOR
END FUNCTION`,
    classicalProblems: ["N-Queens", "Permutations", "Subsets", "Sudoku Solver", "Word Search"],
    industryMapping: ["#031 Fleet Route Planning", "#044 Campus Placement Slot Scheduler", "#075 Tour Itinerary Feasibility"]
  },
  {
    id: "dsa_12",
    name: "Stack",
    coreLogic: "LIFO operations (Last In, First Out)",
    category: "Linear Structures",
    timeComplexity: "O(1) push/pop",
    spaceComplexity: "O(N)",
    icon: "layers",
    whenToUse: "Parentheses validation, undo/redo logs, call traces, parsing expression syntax, depth simulation.",
    template: `FUNCTION validate_matching_brackets(code_string):
    INITIALIZE stack = NEW STACK()
    FOR EACH char IN code_string:
        IF IS_OPENING(char) THEN
            stack.PUSH(char)
        ELSE IF IS_CLOSING(char) THEN
            IF stack.IS_EMPTY() OR NOT MATCH(stack.POP(), char) THEN
                RETURN FALSE
            END IF
        END IF
    END FOR
    RETURN stack.IS_EMPTY()
END FUNCTION`,
    classicalProblems: ["Valid Parentheses", "Evaluate Reverse Polish Notation", "Min Stack", "Daily Temperatures"],
    industryMapping: ["#014 Lab Sample Tracking", "#073 Vehicle Rental Damage Workflow", "#100 Meeting Action Follow-Through"]
  },
  {
    id: "dsa_13",
    name: "Queue",
    coreLogic: "FIFO operations (First In, First Out)",
    category: "Linear Structures",
    timeComplexity: "O(1) enqueue/dequeue",
    spaceComplexity: "O(N)",
    icon: "clock",
    whenToUse: "Task dispatching, printer spooling, message buffers, breadth-first search, round-robin schedulers.",
    template: `FUNCTION process_fifo_queue(task_stream):
    INITIALIZE queue = NEW QUEUE()
    FOR EACH task IN task_stream:
        queue.ENQUEUE(task)
    END FOR
    WHILE NOT queue.IS_EMPTY():
        current_task = queue.DEQUEUE()
        EXECUTE(current_task)
    END WHILE
END FUNCTION`,
    classicalProblems: ["Implement Queue using Stacks", "Moving Average from Data Stream", "Recent Calls Counter"],
    industryMapping: ["#010 Emergency Department Queue Triage", "#052 Help Desk Ticket Routing", "#053 Public Grievance SLA Manager"]
  },
  {
    id: "dsa_14",
    name: "Monotonic Stack",
    coreLogic: "Maintain increasing/decreasing stack",
    category: "Linear Structures",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N)",
    icon: "bar-chart-2",
    whenToUse: "Next greater element, next smaller element, histogram rectangle areas, stock span problems.",
    template: `FUNCTION next_greater_element(arr):
    INITIALIZE n = LENGTH(arr)
    INITIALIZE result = ARRAY of size n filled with -1
    INITIALIZE stack = NEW STACK() // stores indices
    FOR i FROM 0 TO n - 1:
        WHILE NOT stack.IS_EMPTY() AND arr[stack.PEEK()] < arr[i]:
            prev_index = stack.POP()
            result[prev_index] = arr[i]
        END WHILE
        stack.PUSH(i)
    END FOR
    RETURN result
END FUNCTION`,
    classicalProblems: ["Next Greater Element", "Daily Temperatures", "Largest Rectangle in Histogram", "Trapping Rain Water"],
    industryMapping: ["#028 Production Bottleneck Detector", "#068 Industrial Energy Peak Shaving", "#091 Streaming Quality Incident Detector"]
  },
  {
    id: "dsa_15",
    name: "Linked List",
    coreLogic: "Traverse and manipulate nodes using pointers",
    category: "Linear Structures",
    timeComplexity: "O(N) traversal, O(1) insert/delete at pointer",
    spaceComplexity: "O(1)",
    icon: "link-2",
    whenToUse: "Dynamic insertion and deletion without shifting, LRU cache memory lists, blockchain chain blocks.",
    template: `FUNCTION reverse_linked_list(head):
    INITIALIZE prev = NULL, curr = head
    WHILE curr IS NOT NULL:
        next_node = curr.next
        curr.next = prev
        prev = curr
        curr = next_node
    END WHILE
    RETURN prev
END FUNCTION`,
    classicalProblems: ["Reverse Linked List", "Merge Two Sorted Lists", "LRU Cache", "Reorder List"],
    industryMapping: ["#014 Lab Sample Tracking", "#070 Housekeeping Room Turnaround", "#081 Milk Collection Route and Quality Gate"]
  },
  {
    id: "dsa_16",
    name: "Fast & Slow Pointer",
    coreLogic: "Two-speed traversal (Floyd's Cycle Algorithm)",
    category: "Pointers & Windows",
    timeComplexity: "O(N)",
    spaceComplexity: "O(1)",
    icon: "activity",
    whenToUse: "Cycle detection in sequences/linked lists, middle node discovery, palindrome linked lists.",
    template: `FUNCTION detect_cycle(head):
    INITIALIZE slow = head, fast = head
    WHILE fast IS NOT NULL AND fast.next IS NOT NULL:
        slow = slow.next
        fast = fast.next.next
        IF slow == fast THEN
            RETURN TRUE // Cycle detected
        END IF
    END WHILE
    RETURN FALSE
END FUNCTION`,
    classicalProblems: ["Linked List Cycle", "Middle of the Linked List", "Find the Duplicate Number", "Happy Number"],
    industryMapping: ["#040 Training Attendance Reconciliation", "#056 Public Transport Headway Control", "#090 Subscription Entitlement Reconciliation"]
  },
  {
    id: "dsa_17",
    name: "Trees (DFS)",
    coreLogic: "Depth-first recursive traversal (Pre-order, In-order, Post-order)",
    category: "Recursion & Trees",
    timeComplexity: "O(N)",
    spaceComplexity: "O(Height)",
    icon: "git-commit",
    whenToUse: "Hierarchical org charts, file directory traversal, tree height/depth, LCA (lowest common ancestor).",
    template: `FUNCTION dfs_tree(node):
    IF node IS NULL THEN RETURN
    // PRE-ORDER ACTION
    VISIT(node)
    dfs_tree(node.left)
    // IN-ORDER ACTION
    dfs_tree(node.right)
    // POST-ORDER ACTION
END FUNCTION`,
    classicalProblems: ["Maximum Depth of Binary Tree", "Lowest Common Ancestor", "Invert Binary Tree", "Diameter of Binary Tree"],
    industryMapping: ["#043 Learning Content Version Control", "#047 Access Review and Least Privilege", "#082 Food Traceability Recall"]
  },
  {
    id: "dsa_18",
    name: "Trees (BFS)",
    coreLogic: "Level-by-level traversal using a queue",
    category: "Recursion & Trees",
    timeComplexity: "O(N)",
    spaceComplexity: "O(Width)",
    icon: "align-justify",
    whenToUse: "Level-order traversal, finding shortest path in unweighted structures, nearest hierarchical peer.",
    template: `FUNCTION bfs_tree_levels(root):
    IF root IS NULL THEN RETURN []
    INITIALIZE queue = NEW QUEUE()
    queue.ENQUEUE(root)
    INITIALIZE levels = []
    WHILE NOT queue.IS_EMPTY():
        level_size = queue.SIZE()
        current_level = []
        FOR i FROM 0 TO level_size - 1:
            node = queue.DEQUEUE()
            APPEND node.val TO current_level
            IF node.left THEN queue.ENQUEUE(node.left)
            IF node.right THEN queue.ENQUEUE(node.right)
        END FOR
        APPEND current_level TO levels
    END WHILE
    RETURN levels
END FUNCTION`,
    classicalProblems: ["Binary Tree Level Order Traversal", "Binary Tree Zigzag Level Order", "Populating Next Right Pointers"],
    industryMapping: ["#038 Student At-Risk Support Queue", "#085 Network Outage Impact Estimator", "#095 Recruitment Pipeline Bottleneck"]
  },
  {
    id: "dsa_19",
    name: "Heap / Priority Queue",
    coreLogic: "Always access min/max efficiently",
    category: "Advanced Structures",
    timeComplexity: "O(log N) insert/delete, O(1) peek",
    spaceComplexity: "O(N)",
    icon: "chevrons-up",
    whenToUse: "Top K elements, task schedulers, Dijkstra shortest path, dynamic median finder, emergency triage priority.",
    template: `FUNCTION top_k_elements(stream, k):
    INITIALIZE min_heap = NEW MIN_HEAP()
    FOR EACH item IN stream:
        min_heap.PUSH(item)
        IF min_heap.SIZE() > k THEN
            min_heap.POP() // evict smallest
        END IF
    END FOR
    RETURN min_heap.GET_ALL()
END FUNCTION`,
    classicalProblems: ["Kth Largest Element in an Array", "Merge k Sorted Lists", "Find Median from Data Stream", "Task Scheduler"],
    industryMapping: ["#004 Insurance Claim Prioritisation", "#010 Emergency Department Queue Triage", "#032 Predictive Maintenance Work Queue"]
  },
  {
    id: "dsa_20",
    name: "Greedy",
    coreLogic: "Choose the locally optimal solution at each step",
    category: "Algorithms & Optimization",
    timeComplexity: "Typically O(N log N) or O(N)",
    spaceComplexity: "O(1) or O(N)",
    icon: "sparkles",
    whenToUse: "Activity selection, fractional knapsack, interval scheduling, coin change (canonical currencies), optimal caching.",
    template: `FUNCTION greedy_interval_schedule(intervals):
    // 1. Sort by earliest end time
    SORT intervals BY finish_time ASCENDING
    INITIALIZE chosen = []
    INITIALIZE last_end = -INFINITY
    FOR EACH item IN intervals:
        IF item.start_time >= last_end THEN
            APPEND item TO chosen
            last_end = item.finish_time
        END IF
    END FOR
    RETURN chosen
END FUNCTION`,
    classicalProblems: ["Non-overlapping Intervals", "Gas Station", "Jump Game", "Minimum Number of Arrows to Burst Balloons"],
    industryMapping: ["#012 Hospital Bed Allocation", "#022 Store Replenishment Planner", "#064 Battery Dispatch Planner"]
  },
  {
    id: "dsa_21",
    name: "Dynamic Programming (1D)",
    coreLogic: "Store solutions to overlapping subproblems",
    category: "Dynamic Programming",
    timeComplexity: "O(N)",
    spaceComplexity: "O(N) or O(1)",
    icon: "table",
    whenToUse: "Optimizing choices over 1D states (climbing stairs, house robber, coin change, longest increasing subsequence).",
    template: `FUNCTION dp_1d_coin_change(coins, amount):
    INITIALIZE dp = ARRAY of size amount + 1 filled with INFINITY
    dp[0] = 0
    FOR i FROM 1 TO amount:
        FOR EACH c IN coins:
            IF i - c >= 0 THEN
                dp[i] = MIN(dp[i], dp[i - c] + 1)
            END IF
        END FOR
    END FOR
    RETURN (dp[amount] != INFINITY) ? dp[amount] : -1
END FUNCTION`,
    classicalProblems: ["Climbing Stairs", "House Robber", "Coin Change", "Longest Increasing Subsequence"],
    industryMapping: ["#023 Promotion Margin Guardrail", "#039 Adaptive Practice Question Selector", "#068 Industrial Energy Peak Shaving"]
  },
  {
    id: "dsa_22",
    name: "Dynamic Programming (2D)",
    coreLogic: "DP table over two dimensions (grid or two sequences)",
    category: "Dynamic Programming",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(M * N)",
    icon: "grid",
    whenToUse: "Edit distance, longest common subsequence, 0/1 knapsack, matrix path counting with obstacles.",
    template: `FUNCTION dp_2d_lcs(text1, text2):
    m = LENGTH(text1), n = LENGTH(text2)
    INITIALIZE dp = MATRIX of size (m+1) x (n+1) filled with 0
    FOR i FROM 1 TO m:
        FOR j FROM 1 TO n:
            IF text1[i-1] == text2[j-1] THEN
                dp[i][j] = dp[i-1][j-1] + 1
            ELSE
                dp[i][j] = MAX(dp[i-1][j], dp[i][j-1])
            END IF
        END FOR
    END FOR
    RETURN dp[m][n]
END FUNCTION`,
    classicalProblems: ["Longest Common Subsequence", "Edit Distance", "Unique Paths", "0/1 Knapsack"],
    industryMapping: ["#024 Product Substitution Recommender", "#083 Cold Storage Capacity Planner", "#096 Skills-to-Project Staffing"]
  },
  {
    id: "dsa_23",
    name: "Graph DFS",
    coreLogic: "Recursive graph traversal (explore deep along each branch)",
    category: "Graphs & Networks",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    icon: "share-2",
    whenToUse: "Cycle detection in directed graphs, topological sort, connected components, dependency resolution.",
    template: `FUNCTION dfs_graph(node, visited, graph):
    visited.ADD(node)
    PROCESS(node)
    FOR EACH neighbor IN graph[node]:
        IF NOT visited.CONTAINS(neighbor) THEN
            dfs_graph(neighbor, visited, graph)
        END IF
    END FOR
END FUNCTION`,
    classicalProblems: ["Number of Connected Components", "Course Schedule (Topological Sort)", "Clone Graph"],
    industryMapping: ["#033 Quality Defect Containment", "#041 Internship Task Allocation", "#085 Network Outage Impact Estimator"]
  },
  {
    id: "dsa_24",
    name: "Graph BFS",
    coreLogic: "Queue-based graph traversal (explore level by level)",
    category: "Graphs & Networks",
    timeComplexity: "O(V + E)",
    spaceComplexity: "O(V)",
    icon: "radio",
    whenToUse: "Shortest path in unweighted graphs, contagion/blast radius spread, word ladder transforms.",
    template: `FUNCTION bfs_shortest_path(start, target, graph):
    INITIALIZE queue = NEW QUEUE()
    INITIALIZE visited = NEW HASH_SET()
    queue.ENQUEUE([start, 0]) // [node, distance]
    visited.ADD(start)
    WHILE NOT queue.IS_EMPTY():
        [curr, dist] = queue.DEQUEUE()
        IF curr == target THEN RETURN dist
        FOR EACH neighbor IN graph[curr]:
            IF NOT visited.CONTAINS(neighbor) THEN
                visited.ADD(neighbor)
                queue.ENQUEUE([neighbor, dist + 1])
            END IF
        END FOR
    END WHILE
    RETURN -1
END FUNCTION`,
    classicalProblems: ["Word Ladder", "Rotting Oranges", "Minimum Knight Moves", "Shortest Path in Binary Matrix"],
    industryMapping: ["#054 Municipal Waste Collection Routing", "#058 Emergency Resource Dispatch", "#085 Network Outage Impact Estimator"]
  },
  {
    id: "dsa_25",
    name: "Union-Find (DSU)",
    coreLogic: "Merge and find connected components (Disjoint Set Union)",
    category: "Graphs & Networks",
    timeComplexity: "O(alpha(N)) nearly constant with path compression",
    spaceComplexity: "O(N)",
    icon: "git-merge",
    whenToUse: "Detecting cycles in undirected graphs, Kruskal minimum spanning tree, dynamic connectivity, social circles.",
    template: `CLASS DisjointSet:
    CONSTRUCTOR(size):
        parent = ARRAY [0 .. size-1]
        rank = ARRAY of size with 0
    FUNCTION find(x):
        IF parent[x] != x THEN
            parent[x] = find(parent[x]) // Path compression
        END IF
        RETURN parent[x]
    FUNCTION union(x, y):
        rootX = find(x), rootY = find(y)
        IF rootX == rootY THEN RETURN FALSE // Already connected
        // Union by rank
        IF rank[rootX] < rank[rootY] THEN parent[rootX] = rootY
        ELSE IF rank[rootX] > rank[rootY] THEN parent[rootY] = rootX
        ELSE parent[rootY] = rootX; rank[rootX] = rank[rootX] + 1
        RETURN TRUE
END CLASS`,
    classicalProblems: ["Redundant Connection", "Number of Islands II", "Accounts Merge", "Kruskal's MST"],
    industryMapping: ["#055 Water Leakage Prioritisation", "#085 Network Outage Impact Estimator", "#087 Network Capacity Hotspot Planner"]
  },
  {
    id: "dsa_26",
    name: "Trie (Prefix Tree)",
    coreLogic: "Prefix-based tree for strings",
    category: "Advanced Structures",
    timeComplexity: "O(L) insert/lookup where L is key length",
    spaceComplexity: "O(Total Characters * Alphabet)",
    icon: "file-text",
    whenToUse: "Autocomplete, spell check, IP routing prefix lookup, dictionary search, prefix matching.",
    template: `CLASS TrieNode:
    CONSTRUCTOR():
        children = NEW HASH_MAP()
        is_end_of_word = FALSE

CLASS Trie:
    CONSTRUCTOR():
        root = NEW TrieNode()
    FUNCTION insert(word):
        curr = root
        FOR EACH ch IN word:
            IF ch NOT IN curr.children:
                curr.children[ch] = NEW TrieNode()
            curr = curr.children[ch]
        curr.is_end_of_word = TRUE
    FUNCTION starts_with(prefix):
        curr = root
        FOR EACH ch IN prefix:
            IF ch NOT IN curr.children: RETURN FALSE
            curr = curr.children[ch]
        RETURN TRUE
END CLASS`,
    classicalProblems: ["Implement Trie (Prefix Tree)", "Design Add and Search Words", "Word Search II"],
    industryMapping: ["#020 Returns Eligibility Engine", "#057 Permit Application Completeness", "#088 Content Moderation Case Routing"]
  },
  {
    id: "dsa_27",
    name: "Bit Manipulation",
    coreLogic: "Operate directly on binary bits",
    category: "Algorithms & Optimization",
    timeComplexity: "O(1)",
    spaceComplexity: "O(1)",
    icon: "binary",
    whenToUse: "Flag masks, permissions check, parity, power of two checks, space-efficient bitset representations.",
    template: `FUNCTION bit_operations(bitmask):
    // Check if k-th bit is set
    is_set = (bitmask AND (1 SHIFT_LEFT k)) != 0
    // Set k-th bit
    bitmask = bitmask OR (1 SHIFT_LEFT k)
    // Clear k-th bit
    bitmask = bitmask AND NOT(1 SHIFT_LEFT k)
    // Toggle k-th bit
    bitmask = bitmask XOR (1 SHIFT_LEFT k)
    RETURN bitmask
END FUNCTION`,
    classicalProblems: ["Single Number", "Number of 1 Bits", "Counting Bits", "Subsets using Bitmask"],
    industryMapping: ["#047 Access Review and Least Privilege", "#048 Security Patch Prioritisation", "#098 Contract Obligation Tracker"]
  },
  {
    id: "dsa_28",
    name: "Matrix Traversal",
    coreLogic: "Navigate rows and columns systematically",
    category: "Arrays & Searching",
    timeComplexity: "O(M * N)",
    spaceComplexity: "O(1)",
    icon: "grid",
    whenToUse: "Grid maps, warehouse slotting, spreadsheet cells, image pixels, maze solving.",
    template: `FUNCTION traverse_matrix(matrix):
    rows = LENGTH(matrix), cols = LENGTH(matrix[0])
    directions = [[-1, 0], [1, 0], [0, -1], [0, 1]] // UP, DOWN, LEFT, RIGHT
    FOR r FROM 0 TO rows - 1:
        FOR c FROM 0 TO cols - 1:
            PROCESS(matrix[r][c])
            // Explore 4 neighbors
            FOR EACH [dr, dc] IN directions:
                nr = r + dr, nc = c + dc
                IF nr >= 0 AND nr < rows AND nc >= 0 AND nc < cols:
                    PROCESS_NEIGHBOR(matrix[nr][nc])
                END IF
            END FOR
        END FOR
    END FOR
END FUNCTION`,
    classicalProblems: ["Spiral Matrix", "Rotate Image", "Search a 2D Matrix", "Set Matrix Zeroes"],
    industryMapping: ["#030 Warehouse Slotting Optimiser", "#059 Road Maintenance Prioritisation", "#083 Cold Storage Capacity Planner"]
  },
  {
    id: "dsa_29",
    name: "Interval Problems",
    coreLogic: "Sort and merge overlapping intervals",
    category: "Pointers & Windows",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(N)",
    icon: "git-branch",
    whenToUse: "Calendar scheduling, conference room allocation, flight layovers, tariff charge windows, reservation overlap.",
    template: `FUNCTION merge_overlapping_intervals(intervals):
    IF LENGTH(intervals) <= 1 THEN RETURN intervals
    SORT intervals BY start_time ASCENDING
    INITIALIZE merged = [intervals[0]]
    FOR i FROM 1 TO LENGTH(intervals) - 1:
        prev = merged[LAST_INDEX]
        curr = intervals[i]
        IF curr.start_time <= prev.end_time THEN
            prev.end_time = MAX(prev.end_time, curr.end_time) // Merge
        ELSE
            APPEND curr TO merged
        END IF
    END FOR
    RETURN merged
END FUNCTION`,
    classicalProblems: ["Merge Intervals", "Insert Interval", "Meeting Rooms II", "Employee Free Time"],
    industryMapping: ["#064 Battery Dispatch Planner", "#069 Hotel Overbooking Risk Control", "#080 Farm Equipment Sharing Scheduler"]
  },
  {
    id: "dsa_30",
    name: "Divide & Conquer",
    coreLogic: "Break into smaller subproblems and combine",
    category: "Algorithms & Optimization",
    timeComplexity: "O(N log N)",
    spaceComplexity: "O(log N)",
    icon: "split",
    whenToUse: "Mergesort, Quicksort, Closest pair of points, fast exponentiation, Strassen matrix multiplication.",
    template: `FUNCTION divide_and_conquer(problem):
    // 1. BASE CASE
    IF IS_SMALL_ENOUGH(problem) THEN
        RETURN SOLVE_DIRECTLY(problem)
    END IF
    // 2. DIVIDE
    [subproblem1, subproblem2] = SPLIT(problem)
    // 3. CONQUER
    sub_result1 = divide_and_conquer(subproblem1)
    sub_result2 = divide_and_conquer(subproblem2)
    // 4. COMBINE
    RETURN COMBINE_RESULTS(sub_result1, sub_result2)
END FUNCTION`,
    classicalProblems: ["Merge Sort", "Kth Largest Element (QuickSelect)", "Pow(x, n)", "Maximum Subarray (D&C)"],
    industryMapping: ["#029 Supplier Delivery Reliability Score", "#033 Quality Defect Containment", "#089 Digital Ad Pacing Controller"]
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DSA_PATTERNS };
}
