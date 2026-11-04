import type { LanguageId } from '@/lib/services/judgeService'

// Setup only: reads all input tokens. The student writes the solution.
export const STARTERS: Record<LanguageId, string> = {
  100: `import sys

def main():
    data = sys.stdin.read().split()
    values = list(map(int, data))
    # Use values as described in the problem statement,
    # then print your answer with print(...)

main()
`,
  105: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    vector<long long> values;
    long long x;
    while (cin >> x) values.push_back(x);

    // Use values as described in the problem statement,
    // then print your answer with cout.
    return 0;
}
`,
  91: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws IOException {
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = br.readLine()) != null) sb.append(line).append(' ');

        StringTokenizer st = new StringTokenizer(sb.toString());
        List<Long> values = new ArrayList<>();
        while (st.hasMoreTokens()) values.add(Long.parseLong(st.nextToken()));

        // Use values as described in the problem statement,
        // then print your answer with System.out.println(...)
    }
}
`,
}